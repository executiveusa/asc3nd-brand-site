# ASC3ND Vercel Release Lock

This repository must deploy only to the locked ASC3ND brand-site project unless the owner explicitly changes the decision.

- Vercel project name: `asc3nd-brand-site`
- Vercel project ID: `prj_oVvM9X5f4LNt3xwSV0Cl3ujiaIqn`
- Vercel team ID: `team_2MkWeFBaSCv7DOvEy0OlX4s3`
- GitHub source: `executiveusa/asc3nd-brand-site`
- Production branch: `main`
- Runtime target: Node `24.x`

## Release proof

A release is not considered current until all of the following are proven:

1. the deployment belongs to `prj_oVvM9X5f4LNt3xwSV0Cl3ujiaIqn`;
2. deployment metadata resolves to `executiveusa/asc3nd-brand-site` and `main`;
3. the deployed Git SHA equals the current `main` SHA;
4. build logs complete successfully;
5. `/`, `/staff`, `/unsubscribe`, and `/api/community/join` are reachable as intended;
6. one synthetic community signup reaches canonical ASC3ND Supabase and is removed after verification;
7. the legacy event production deployment remains available as rollback until the new site passes cutover proof;
8. The Extractor strict anti-slop gate passes;
9. `robots.txt` and `sitemap.xml` behave correctly for the canonical domain and Vercel previews remain non-indexable.

## Git reconnect release trigger

Git integration is active on the canonical project above. A second Vercel project named `asc3nd-brand-site-nywi` is also connected to the same GitHub repository; it is not canonical. Do not delete or repoint it without explicit owner approval. New releases must be verified against the canonical project ID above.

## Current connector limitation

The connected deployment action currently exposes a no-argument interface while its backend requires `target`, `name`, and `files`. Do not work around this by creating a different Vercel project. Preferred recovery is to restore Git integration for this locked project or use a corrected deployment action targeting this exact project.
