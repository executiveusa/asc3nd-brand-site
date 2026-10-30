#!/usr/bin/env bash
# One-time, per-machine setup for token-saving agent tooling used on this repo.
# Commands are taken from each project's own install docs (checked 2026-10-30).
# Read the remote scripts before running if you prefer: each line is independent.
set -euo pipefail

echo "== rtk (Rust Token Killer): shell-output compression for Claude Code"
if rtk gain >/dev/null 2>&1; then
  echo "rtk already installed (rtk gain works)"
else
  # 'rtk --version' working but 'rtk gain' failing means the unrelated Rust Type Kit is installed; remove it first.
  curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/master/install.sh | sh
fi
rtk init -g --auto-patch   # registers the PreToolUse hook so commands are rewritten through rtk
rtk gain                   # must print the savings dashboard

echo "== caveman: terse agent output (pinned v4.0.1)"
claude plugin marketplace add JuliusBrussee/caveman
claude plugin install caveman@caveman

echo "== jcodemunch: symbol-level code navigation MCP"
echo "Project-scoped via .mcp.json in this repo; needs uv (uvx) on PATH."
command -v uvx >/dev/null || echo "Install uv first: https://docs.astral.sh/uv/"

echo "Done. Restart Claude Code, then run /mcp to confirm jcodemunch is connected."
