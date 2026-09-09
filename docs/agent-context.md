# ASC3ND Brand Site — Agent Context

## Repo Purpose
Official brand website for ASC3ND (asc3nd.org), showcasing mission, founders, community events (Community Cuts for Kids), and intake pathways.

## Stack
- Next.js 16 (App Router)
- React 19
- TypeScript
- Plain CSS with CSS Custom Properties and editorial serif typography (Georgia)
- Deployed on Netlify

## Mobile Ergonomics & Polish Conventions (MPP-v1.0)
- **Hero Wordmark**: Constrained mobile clamp `clamp(2.1rem, 10vw, 2.75rem)` with `white-space: nowrap; overflow-wrap: normal;` preventing mid-word breaks (`ASC3ND.O` / `RG`).
- **Hero Mission Statements**: Class `.hero-statement-line` with mobile clamp `clamp(1.2rem, 6vw, 1.65rem)` and line-height `1.18`–`1.22`, preventing glyph collision.
- **Founders Section**: Portrait placeholders capped at 4:5 aspect ratio (`max-height: 420px`); quotes scaled via `clamp(1.25rem, 5.2vw, 1.85rem)` with `line-height: 1.35`.
- **Desktop Invariance**: Desktop layout (>900px) is 100% frozen.

## Build & Validation Commands
- `pnpm install`
- `pnpm build`
