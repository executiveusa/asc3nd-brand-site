#!/usr/bin/env python3
"""Download, optimize, inventory, and wire the approved Community Cuts photo set.

Source: Google Drive folder supplied by the ASC3ND owner.
Destination: public/images/projects/community-cuts/*.jpg plus 640/1024/1600 px WebP renditions.

This pipeline intentionally stores web-ready derivatives in GitHub rather than multi-megabyte
camera originals. The originals remain in the owner-controlled Drive folder.

Alt text and the curated order of the first photos live in scripts/community-cuts-alt.json and
survive regeneration. To change either one, or to regenerate the WebP files and the TypeScript
manifest from the committed JPEGs without downloading anything, run:

    python3 scripts/import-community-cuts-photos.py --rebuild
"""

from __future__ import annotations

import json
import re
import shutil
import sys
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE_FOLDER = "https://drive.google.com/drive/folders/1QXJK7WwEqhugArmSiFVh_Ysq7Ci1dDB8"
RAW_DIR = ROOT / ".tmp" / "community-cuts-drive"
DEST_DIR = ROOT / "public" / "images" / "projects" / "community-cuts"
MANIFEST_TS = ROOT / "lib" / "community-cuts-media.generated.ts"
PROJECTS_TS = ROOT / "lib" / "projects.ts"
AUDIT_JSON = ROOT / "docs" / "community-cuts" / "PHOTO_IMPORT_AUDIT.json"
ALT_JSON = ROOT / "scripts" / "community-cuts-alt.json"
EXPECTED_COUNT = 86
MAX_LONG_EDGE = 1600
JPEG_QUALITY = 82
WEBP_WIDTHS = (640, 1024, 1600)
WEBP_QUALITY = 78
CAPTION = "Community Cuts for Kids, Everett, Washington, August 2026"


def natural_key(path: Path):
    return [int(part) if part.isdigit() else part.lower() for part in re.split(r"(\d+)", path.name)]


def download_source() -> list[Path]:
    import gdown  # imported here so --rebuild works without it

    if RAW_DIR.exists():
        shutil.rmtree(RAW_DIR)
    RAW_DIR.mkdir(parents=True, exist_ok=True)

    result = gdown.download_folder(
        url=SOURCE_FOLDER,
        output=str(RAW_DIR),
        quiet=False,
        use_cookies=False,
    )
    if not result:
        raise RuntimeError("Google Drive folder download returned no files")

    photos = sorted(
        [
            path
            for path in RAW_DIR.rglob("*")
            if path.is_file() and path.suffix.lower() in {".jpg", ".jpeg"}
        ],
        key=natural_key,
    )
    if len(photos) != EXPECTED_COUNT:
        raise RuntimeError(f"Expected {EXPECTED_COUNT} photos, downloaded {len(photos)}")
    return photos


def optimize(photos: list[Path]) -> list[dict]:
    DEST_DIR.mkdir(parents=True, exist_ok=True)
    for stale in DEST_DIR.glob("community-cuts-*"):
        stale.unlink()

    manifest: list[dict] = []
    for index, source in enumerate(photos, start=1):
        output_name = f"community-cuts-{index:03d}.jpg"
        destination = DEST_DIR / output_name

        with Image.open(source) as original:
            image = ImageOps.exif_transpose(original).convert("RGB")
            width, height = image.size
            longest = max(width, height)
            if longest > MAX_LONG_EDGE:
                scale = MAX_LONG_EDGE / longest
                image = image.resize(
                    (max(1, round(width * scale)), max(1, round(height * scale))),
                    Image.Resampling.LANCZOS,
                )
            out_width, out_height = image.size
            image.save(
                destination,
                format="JPEG",
                quality=JPEG_QUALITY,
                optimize=True,
                progressive=True,
            )

        manifest.append(
            {
                "id": f"community-cuts-photo-{index:03d}",
                "src": f"/images/projects/community-cuts/{output_name}",
                "caption": CAPTION,
                "width": out_width,
                "height": out_height,
                "sourceFile": source.name,
                "bytes": destination.stat().st_size,
            }
        )
    return manifest


def describe_existing() -> list[dict]:
    """Inventory the committed JPEGs (used by --rebuild; no network)."""
    manifest: list[dict] = []
    for jpg in sorted(DEST_DIR.glob("community-cuts-[0-9][0-9][0-9].jpg")):
        index = int(jpg.stem.split("-")[-1])
        with Image.open(jpg) as image:
            width, height = ImageOps.exif_transpose(image).size
        manifest.append(
            {
                "id": f"community-cuts-photo-{index:03d}",
                "src": f"/images/projects/community-cuts/{jpg.name}",
                "caption": CAPTION,
                "width": width,
                "height": height,
                "bytes": jpg.stat().st_size,
            }
        )
    if len(manifest) != EXPECTED_COUNT:
        raise RuntimeError(f"Expected {EXPECTED_COUNT} photos on disk, found {len(manifest)}")
    return manifest


def webp_widths(width: int) -> list[int]:
    """640/1024/1600, capped at the source width, which is always the largest rendition."""
    widths = [w for w in WEBP_WIDTHS if w < width]
    if widths and width <= widths[-1] * 1.1:
        return widths[:-1] + [width]  # source barely wider than the last step: no near-duplicate
    return widths + [width]


def make_webp(jpg: Path) -> list[dict]:
    """Write metadata-free WebP renditions next to a JPEG and return them."""
    variants: list[dict] = []
    with Image.open(jpg) as original:
        image = ImageOps.exif_transpose(original).convert("RGB")
        for target in webp_widths(image.width):
            if target == image.width:
                resized = image
            else:
                resized = image.resize(
                    (target, max(1, round(image.height * target / image.width))),
                    Image.Resampling.LANCZOS,
                )
            out = jpg.with_name(f"{jpg.stem}-{target}.webp")
            resized.save(out, format="WEBP", quality=WEBP_QUALITY, method=6)
            variants.append({"width": target, "src": f"/images/projects/community-cuts/{out.name}"})
    return variants


def load_alt_config(manifest: list[dict]) -> dict:
    config = json.loads(ALT_JSON.read_text(encoding="utf-8"))
    ids = {item["id"] for item in manifest}
    missing = sorted(ids - set(config["alt"]))
    if missing:
        raise RuntimeError(f"Alt text missing for: {missing}")
    unknown = sorted(set(config["alt"]) - ids)
    if unknown:
        raise RuntimeError(f"Alt text for unknown photos: {unknown}")
    order = config["curatedOrder"]
    if len(set(order)) != len(order) or not set(order) <= ids:
        raise RuntimeError("curatedOrder must list distinct, known photo ids")
    return config


def curate(manifest: list[dict], curated: list[str]) -> list[dict]:
    by_id = {item["id"]: item for item in manifest}
    first = [by_id[photo_id] for photo_id in curated]
    rest = [item for item in manifest if item["id"] not in set(curated)]
    return first + rest


def write_typescript(manifest: list[dict]) -> None:
    config = load_alt_config(manifest)
    manifest = curate(manifest, config["curatedOrder"])
    lines = [
        'import type { ProjectMediaItem } from "./projects";',
        "",
        "// Generated by scripts/import-community-cuts-photos.py. Do not edit by hand:",
        "// alt text and the curated order live in scripts/community-cuts-alt.json.",
        "// Owner authorized publication of the supplied Community Cuts photo set on 2026-09-16.",
        "export const communityCutsMedia: ProjectMediaItem[] = [",
    ]
    for position, item in enumerate(manifest):
        variant_lines = [
            f'      {{ width: {v["width"]}, src: "{v["src"]}" }},' for v in item.get("variants", [])
        ]
        lines.extend(
            [
                "  {",
                f'    id: "{item["id"]}",',
                '    type: "image",',
                f'    src: "{item["src"]}",',
                f'    alt: {json.dumps(config["alt"][item["id"]], ensure_ascii=False)},',
                f'    caption: {json.dumps(item["caption"], ensure_ascii=False)},',
                "    approved: true,",
                "    consentConfirmed: true,",
                f"    featured: {str(position == 0).lower()},",
                f'    width: {item["width"]},',
                f'    height: {item["height"]},',
                "    variants: [",
                *variant_lines,
                "    ],",
                "  },",
            ]
        )
    lines.extend(["];", ""])
    MANIFEST_TS.write_text("\n".join(lines), encoding="utf-8")


def wire_project_model() -> None:
    source = PROJECTS_TS.read_text(encoding="utf-8")
    import_line = 'import { communityCutsMedia } from "./community-cuts-media.generated";\n\n'
    if import_line.strip() not in source:
        source = import_line + source

    source, count = re.subn(
        r'(export const communityCutsProject: Asc3ndProject = \{[\s\S]*?featuredFilm: \{[\s\S]*?\},\n)  media: \[\],',
        r'\1  media: communityCutsMedia,',
        source,
        count=1,
    )
    if count != 1 and "media: communityCutsMedia," not in source:
        raise RuntimeError("Could not wire generated Community Cuts media into lib/projects.ts")

    PROJECTS_TS.write_text(source, encoding="utf-8")


def write_audit(manifest: list[dict]) -> None:
    AUDIT_JSON.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "sourceFolder": SOURCE_FOLDER,
        "expectedCount": EXPECTED_COUNT,
        "importedCount": len(manifest),
        "maxLongEdge": MAX_LONG_EDGE,
        "jpegQuality": JPEG_QUALITY,
        "outputDirectory": str(DEST_DIR.relative_to(ROOT)),
        "totalOptimizedBytes": sum(item["bytes"] for item in manifest),
        "items": [
            {
                "sourceFile": item["sourceFile"],
                "src": item["src"],
                "width": item["width"],
                "height": item["height"],
                "bytes": item["bytes"],
            }
            for item in manifest
        ],
    }
    AUDIT_JSON.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    rebuild = "--rebuild" in sys.argv[1:]
    if rebuild:
        manifest = describe_existing()
    else:
        manifest = optimize(download_source())

    for item in manifest:
        item["variants"] = make_webp(ROOT / "public" / item["src"].lstrip("/"))

    write_typescript(manifest)
    wire_project_model()
    if not rebuild:
        write_audit(manifest)
    print(f"{'Rebuilt' if rebuild else 'Imported'} {len(manifest)} Community Cuts photos")
    print(f"JPEG bytes: {sum(item['bytes'] for item in manifest):,}")


if __name__ == "__main__":
    main()
