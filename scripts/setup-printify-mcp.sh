#!/usr/bin/env bash
# Builds the Printify MCP server for local agent use. It is NOT part of the website and is never deployed.
# Source: https://github.com/TSavo/printify-mcp, pinned to one commit and patched (see scripts/printify-mcp.patch).
set -euo pipefail

PIN="951287b470c2d351e5a8cfd862d1d0ef3a6bf9c4"
HOME_DIR="${PRINTIFY_MCP_HOME:-$HOME/.local/share/asc3nd/printify-mcp}"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -f "$HOME_DIR/dist/index.js" ] && [ "${1:-}" != "--force" ]; then
  echo "printify-mcp already built at $HOME_DIR (use --force to rebuild)"; exit 0
fi

rm -rf "$HOME_DIR"
mkdir -p "$HOME_DIR"
git init -q "$HOME_DIR"
git -C "$HOME_DIR" remote add origin https://github.com/TSavo/printify-mcp.git
git -C "$HOME_DIR" fetch -q --depth 1 origin "$PIN"
git -C "$HOME_DIR" checkout -q FETCH_HEAD
git -C "$HOME_DIR" apply "$HERE/printify-mcp.patch"
# --ignore-scripts: nothing in the dependency tree gets to run code at install time.
( cd "$HOME_DIR" && npm ci --ignore-scripts --no-audit --no-fund && npx --no-install tsc && npm run --silent copy-docs )
echo "printify-mcp built at $HOME_DIR"
