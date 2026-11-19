#!/usr/bin/env python3
"""Install the client-supplied Project Joy assets into this repository, safely.

Usage:
  python scripts/install_project_joy_assets.py /path/to/ASC3ND_Project_Joy_Assets_Ready_For_Repo.zip

Does not modify source code, push commits, deploy, or change DNS.
Requires the exact client ZIP named in docs/PROJECT_JOY_2026_RELEASE_HANDOFF.md.
"""
import hashlib
import json
import pathlib
import sys
import zipfile

ROOT = pathlib.Path(__file__).resolve().parents[1]
TARGETS = {
    "project-joy-final-logo-original.png": "public/images/project-joy/client-final-logo.png",
    "project-joy-amazon-qr-original.jpg": "public/images/project-joy/amazon-wishlist-qr.jpg",
    "project-joy-zeffy-branded-qr-original.png": "public/images/project-joy/zeffy-donation-qr.png",
}


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python scripts/install_project_joy_assets.py /path/to/client-assets.zip")
    archive = pathlib.Path(sys.argv[1]).resolve()
    with zipfile.ZipFile(archive) as z:
        manifest = json.loads(z.read("MANIFEST.json"))
        listed = {item["path"]: item for item in manifest["files"]}
        expected_logos = set(manifest["partners"])
        if len(expected_logos) != 13:
            raise SystemExit("Client asset package must contain exactly 13 partner organizations")
        selected = {
            item["path"]: "public/images/partners/" + item["path"].split("/", 1)[1]
            for item in manifest["files"] if item["path"].startswith("partners/")
        }
        selected.update(TARGETS)
        for name, output in selected.items():
            if name not in z.namelist():
                raise SystemExit("Missing archive member: " + name)
            data = z.read(name)
            if name in listed and hashlib.sha256(data).hexdigest() != listed[name]["sha256"]:
                raise SystemExit("Invalid SHA256 for client-provided file: " + name)
            dest = ROOT / output
            if dest.exists():
                if dest.read_bytes() != data:
                    raise SystemExit("Refusing to overwrite different existing asset: " + str(dest))
                continue
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(data)
            print(output)
        for slug in expected_logos:
            if not (ROOT / ("public/images/partners/" + slug + ".webp")).is_file():
                raise SystemExit("Missing optimized logo: " + slug)
    print("Client asset package installed and all 13 logo derivatives verified.")


if __name__ == "__main__":
    main()
