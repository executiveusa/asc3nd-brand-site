# ASC3ND Vercel Release Lock

This repository must deploy only to the locked ASC3ND brand-site project unless the owner explicitly changes the decision.

- Vercel project name: `asc3nd-brand-site`
- Vercel project ID: `prj_9CILXFMCnQh4ZsTirsArBrsVoTfV`
- Vercel team ID: `team_5qS6dGopLozD0HWaND62MGtM`
- GitHub source: `executiveusa/asc3nd-brand-site`
- Production branch: `main`
- Runtime target: Node `24.x`

## Release proof

A release is not considered current until all of the following are proven:

1. the deployment belongs to `prj_9CILXFMCnQh4ZsTirsArBrsVoTfV`;
2. deployment metadata resolves to `executiveusa/asc3nd-brand-site` and `main`;
3. the deployed Git SHA equals the current `main` SHA;
4. build logs complete successfully;
5. `/`, `/staff`, `/unsubscribe`, and `/api/community/join` are reachable as intended;
6. one synthetic community signup reaches canonical ASC3ND Supabase and is removed after verification;
7. the legacy event production deployment remains available as rollback until the new site passes cutover proof.

## Git reconnect release trigger

Git integration was reconnected by the owner on 2026-09-02. This commit is the deliberate post-reconnect release trigger for the locked project. Do not create a replacement Vercel project if deployment does not fire; diagnose the existing Git integration and project binding instead.

## Current connector limitation

The connected deployment action currently exposes a no-argument interface while its backend requires `target`, `name`, and `files`. Do not work around this by creating a different Vercel project. Preferred recovery is to restore Git integration for this locked project or use a corrected deployment action targeting this exact project.
