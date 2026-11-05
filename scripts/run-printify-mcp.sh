#!/usr/bin/env bash
# Starts the Printify MCP server over stdio. Reads PRINTIFY_API_KEY and PRINTIFY_SHOP_ID from the environment only.
set -euo pipefail

HOME_DIR="${PRINTIFY_MCP_HOME:-$HOME/.local/share/asc3nd/printify-mcp}"
[ -f "$HOME_DIR/dist/index.js" ] || { echo "printify-mcp is not built. Run scripts/setup-printify-mcp.sh" >&2; exit 1; }

# The server writes a debug/ folder and loads .env from its working directory. Keep both away from the repo.
WORK="${XDG_CACHE_HOME:-$HOME/.cache}/asc3nd/printify-mcp-work"
mkdir -p "$WORK"
cd "$WORK"

# No third-party image services: AI image generation and imgbb hosting stay off.
unset REPLICATE_API_TOKEN IMGBB_API_KEY

exec node "$HOME_DIR/dist/index.js"
