# CLAUDE.md

Read `AGENTS.md` first. It governs this repo. This file adds token discipline for Claude Code.

## Token-saving tooling (required)

First session on a machine: run `scripts/setup-agent-tooling.sh`, then restart Claude Code.

- **rtk**: shell output goes through rtk. The global hook rewrites commands automatically; if the hook is missing, prefix commands with `rtk` (for example `rtk git status`, `rtk npm run build`). Check with `rtk gain`.
- **caveman**: use caveman mode for agent-facing output only: status updates, plans, reviews, commit bodies, handoffs.
- **jcodemunch** (MCP, configured in `.mcp.json`): find symbols, importers and blast radius with jcodemunch before opening whole files. Do not read a file end to end to find one function.

## Where terse output is forbidden

Caveman style never applies to anything a visitor, donor, family or the ASC3ND founders will read: site copy, alt text, form labels, emails, documents and PR descriptions shown to the client. Those follow the design rules below and The Extractor.

## Design rules for this site

- Bar: wearecollins.com. Compare screenshots at 1440 and 390 before calling a page done.
- Type: Gelasio (display) and Hanken Grotesk (text), self-hosted in `public/fonts`. No system-font fallbacks as the design.
- The wordmark is `components/BrandLogo.tsx`, outlined paths. Never re-render it as live text or regenerate it with an image model.
- Arrows stay: `→` for links within the site, `↗` for links that leave it, as an `aria-hidden` span.
- No `01 / 02 / 03` numbering unless the content is a real sequence. No tracked ALL-CAPS labels.
- Run The Extractor (`executiveusa/the-extractor`) in strict mode on changed copy before a PR.
