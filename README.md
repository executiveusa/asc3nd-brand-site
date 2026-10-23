# ASC3ND Brand Site

Canonical public-brand repository for ASC3ND.

## Status

Phase 1 foundation is under active review. Production cutover is not approved.

## Governing idea

**Community came through. Now we build forward.**

## Architecture

- Next.js App Router
- TypeScript
- No generic component library
- Editorial layout system
- Documentary media slots
- Mobile recomposition, not desktop shrinking
- Reduced-motion support

## Protected boundary

This repository is the new public brand site. Existing RSVP, confirmation, staff, check-in, export, and database behavior remain outside this repository until separately migrated and verified.

## Deployment target

Vercel project: `asc3nd-brand-site`
Project ID: `prj_oVvM9X5f4LNt3xwSV0Cl3ujiaIqn`

Current verified Vercel production baseline: `42a92a5d8f1b920bc5d8b01d15f9e6004e69ed1e`.

Do not claim the custom-domain cutover complete until `asc3nd.org` and `www.asc3nd.org` are attached to this project, the exact promoted SHA is verified, and rollback is recorded.
