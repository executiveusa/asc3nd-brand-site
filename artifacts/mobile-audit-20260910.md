# ASC3ND mobile audit

Date: 2026-09-10

Source of truth: `executiveusa/asc3nd-brand-site`

Visual reference: `https://asc3nd-org.netlify.app/`

Audit branch: `codex/asc3nd-brand-audit-20260910`

## Scope

The Netlify holding page was treated as intentional. Copy, labels, placeholders, and claims were not changed.

The live page was inspected in a browser and in mobile-rendered browser captures at 375×812, 390×844, and 430×932. The available browser session did not expose viewport emulation or a mobile interaction context, so live tap/keyboard behavior at those exact widths remains a verification limitation. The source-level checks and production build were run in the audit worktree.

## Changes applied in the audit worktree

- Added an explicit Next.js viewport contract with `device-width`, `initialScale: 1`, and `viewport-fit: cover`.
- Added global `max-width: 100vw`, `overscroll-behavior-y: none`, and `scroll-padding-top: 80px`.
- Added `touch-action: manipulation` and a short active-state transition for links and buttons.
- Enforced 16px controls on screens up to 640px to prevent iOS Safari input zoom.
- Ensured participation form controls and submit buttons have at least 44px physical height.

## Compliance result

| Gate | Result | Evidence |
| --- | --- | --- |
| Viewport contract | PASS in worktree | `app/layout.tsx` exports `viewport` with `viewportFit: "cover"`. |
| Horizontal containment | PASS in source | `html` and `body` constrain overflow; live desktop page measured `scrollWidth` below `innerWidth`. |
| iOS form zoom prevention | PASS in worktree | Mobile rule forces `input`, `select`, and `textarea` to 16px. |
| 44px touch targets | PASS for primary public navigation/forms | Public nav links, footer links, social links, choice rows, and form buttons have 44px minimum heights; checkboxes remain native-sized inside labelled rows. |
| Tactile active state | PASS in worktree | Global touch action plus active transition; existing primary controls retain compression states. |
| Responsive grids | PASS by source review | Founder grid becomes one column; participation grid becomes one column under 700px. |
| Thumb-zone drawer | N/A | The holding page has no floating dropdown or mobile drawer to replace. |
| Safe-area handling | PARTIAL | `viewport-fit` is explicit; no fixed footer/drawer exists that requires inset padding. |
| Fluid typography | PASS with caution | Public headings use clamps; narrow hero lines intentionally remain unbroken to preserve the approved lockup. |
| Persistent form labels | PASS | Public forms use visible labels; placeholders are supplementary. |
| Contextual keyboards | PASS for public fields | Email fields use `type="email"`; participation phone field uses `type="tel"`; names use `autocomplete`. |
| Public route orientation | PASS | Mobile-rendered HTML includes ASC3ND branding, section identity, and a home path on interior routes. |
| Console health | CAUTION | Earlier live browser inspection found repeated Supabase multiple-client warnings; extension-origin errors were browser noise. |

## Build verification

- `pnpm build`: PASS
- `pnpm exec tsc --noEmit`: PASS
- `git diff --check`: PASS

## Remaining blockers

1. The changes are local to the audit worktree and are not in the live Netlify deployment until the branch is reviewed and deployed.
2. Exact mobile tap, focus, drawer, and no-zoom interaction checks need a browser session with device viewport emulation.
3. The holding page still contains intentional content placeholders; replacing them requires approved founder/community content and is outside this mobile-only patch.
