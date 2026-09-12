#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <video-file> <output-dir> [fps]"
  echo "Example: $0 ./community-cuts.mp4 ./stills 1/8"
  exit 1
fi

INPUT="$1"
OUTPUT="$2"
FPS="${3:-1/8}"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg is required. Install ffmpeg or use LosslessCut for manual frame selection."
  exit 1
fi

if [ ! -f "$INPUT" ]; then
  echo "Video not found: $INPUT"
  exit 1
fi

mkdir -p "$OUTPUT"

ffmpeg -hide_banner -loglevel warning \
  -i "$INPUT" \
  -vf "fps=${FPS}" \
  -q:v 2 \
  "$OUTPUT/frame-%05d.jpg"

echo "Extracted candidate stills to $OUTPUT"
echo "Review, deduplicate, confirm consent, and only then add approved frames to the ASC3ND project media registry."
