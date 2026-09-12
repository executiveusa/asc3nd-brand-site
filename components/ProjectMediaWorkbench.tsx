"use client";

import { useMemo, useState } from "react";
import { Download, Image as ImageIcon, Video } from "lucide-react";
import styles from "@/app/staff/staff.module.css";

type IntakeFile = {
  name: string;
  type: string;
  size: number;
  kind: "image" | "video" | "other";
};

function classify(type: string): IntakeFile["kind"] {
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  return "other";
}

function readableSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ProjectMediaWorkbench() {
  const [files, setFiles] = useState<IntakeFile[]>([]);
  const projectSlug = "community-cuts";
  const manifest = useMemo(
    () => ({
      project: projectSlug,
      createdAt: new Date().toISOString(),
      destination: `project-media/${projectSlug}/intake/`,
      publishRule: "Nothing is public until approval and consent are confirmed.",
      files: files.map((file) => ({ ...file, approved: false, consentConfirmed: false })),
    }),
    [files],
  );

  function choose(event: React.ChangeEvent<HTMLInputElement>) {
    const next = Array.from(event.target.files || []).map((file) => ({
      name: file.name,
      type: file.type || "application/octet-stream",
      size: file.size,
      kind: classify(file.type),
    }));
    setFiles(next);
  }

  function exportManifest() {
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${projectSlug}-media-intake.json`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  return (
    <section className={styles.dashboard} aria-labelledby="project-media-title">
      <div className={styles.queueHeader}>
        <div><span>Project media</span><h2 id="project-media-title">Community Cuts intake</h2></div>
        <strong>{files.length ? `${files.length} selected` : "Project 001"}</strong>
      </div>
      <p className={styles.notice}>
        Stage photos and video here before publication. Large master video stays outside GitHub; use this tool to create the intake manifest, then the agent can process stills, clips, captions, approval, and project placement.
      </p>
      <div className={styles.signInRow}>
        <label>
          <span className="sr-only">Choose project photos or videos</span>
          <input type="file" accept="image/*,video/*" multiple onChange={choose} />
        </label>
        <button type="button" onClick={exportManifest} disabled={!files.length}><Download size={16}/> Export intake manifest</button>
      </div>
      {files.length ? (
        <div className={styles.tableWrap}>
          <table>
            <thead><tr><th>Media</th><th>Type</th><th>Size</th><th>Publish state</th></tr></thead>
            <tbody>{files.map((file) => (
              <tr key={`${file.name}-${file.size}`}>
                <td><strong>{file.name}</strong></td>
                <td><span>{file.kind === "video" ? <Video size={15}/> : <ImageIcon size={15}/>} {file.kind}</span></td>
                <td>{readableSize(file.size)}</td>
                <td><span className={styles.pill}>intake only</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
