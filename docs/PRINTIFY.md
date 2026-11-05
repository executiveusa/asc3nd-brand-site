# Printify setup

The shop pages (`/shop`, `/es/tienda`) read products from Printify on the server. With no credentials, or no published product, they show the "Shop opening soon" state. Nothing here ever reaches the browser.

**Never commit, paste into chat, log or screenshot the token.** It lives only in the host secret stores below.

## Environment variables

| Variable | Used by | Value |
|---|---|---|
| `PRINTIFY_API_TOKEN` | the website (`lib/printify.ts`) | Printify personal access token |
| `PRINTIFY_SHOP_ID` | the website and the agent tool | numeric Printify shop id |
| `PRINTIFY_STOREFRONT_URL` | the website | `https://` origin of the sales channel storefront (for example a Printify Pop-Up Store). Only needed when a product's `external.handle` is a relative path |

The local agent tool (below) reads the same token under the name `PRINTIFY_API_KEY`. Same value, different name, because the upstream tool expects that name.

## Where each one lives

| Host | Name in the host | Targets |
|---|---|---|
| Netlify, site `asc3nd-org` | Site configuration, Environment variables | Production and Deploy Previews |
| Vercel, project `asc3nd-brand-site` (team `the-pauli-effect`) | Settings, Environment Variables | Production and Preview |
| Claude Code cloud environment | Environment settings, secrets | `PRINTIFY_API_KEY`, `PRINTIFY_SHOP_ID` (agent tool only) |

Only the canonical Vercel project holds these. The other Vercel projects connected to this repository must not.

Mark the token as secret or sensitive in each host so it cannot be read back.

## Token scopes

The website only reads, so a token with read scopes for shops and products is enough for it. The agent tool also creates and uploads, so it needs write scopes for products and uploads. Prefer two tokens: a read-only one for the hosts, and a separate write token for the agent tool. Printify lets you choose scopes when you generate a token.

## Rotating the token

1. In Printify, open the account menu, then Connections (API tokens). Menu names change; look for personal access tokens.
2. Generate the new token with the scopes above.
3. Replace the value in Netlify, Vercel and the Claude Code environment. Set it in all targets (production and preview) before revoking anything.
4. Redeploy Netlify and Vercel (build-time and server variables are read at deploy time).
5. Open `/shop`. A published product shows a card; none shows "Shop opening soon". Neither shows an error.
6. Revoke the old token in Printify.
7. If a token was ever pasted anywhere it should not be (chat, commit, log), revoke it first, then rotate.

## What makes a product appear

A product is listed only if it is visible, has a title, has an enabled and available variant with a price, and has a real purchase link. The Printify API has no checkout of its own. A buy link exists only when the product is published to a sales channel that writes `external.handle`:

- A full `https://` handle is used as the link.
- A relative handle is combined with `PRINTIFY_STOREFRONT_URL`.
- Otherwise the product is hidden.

The founders approve products and prices in Printify and publish them. Agents never publish and never set prices.

## Agent tool (local, not shipped with the site)

`scripts/setup-printify-mcp.sh` builds [TSavo/printify-mcp](https://github.com/TSavo/printify-mcp) v0.1.1 at a pinned commit (`951287b`), applies `scripts/printify-mcp.patch`, and installs dependencies with `--ignore-scripts`. `.mcp.json` runs it through `scripts/run-printify-mcp.sh`, which passes the two variables from the environment, runs from a scratch directory outside the repository, and blanks `REPLICATE_API_TOKEN` and `IMGBB_API_KEY` so no image goes to a third party.

The patch does three things: sends `console.log` to stderr (stdout is the MCP protocol channel), stops logging a prefix of the token, and turns off the SDK's request logging.

Known limits: the upstream dependency tree reports 11 production vulnerabilities (mostly denial-of-service in server code this tool does not run, plus image-library CVEs in `sharp`). The tool exposes `publish_product`, `delete_product` and `update_product`; do not auto-approve those.
