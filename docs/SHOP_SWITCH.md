# Shop switch

One setting controls whether a shop exists on the public site. It is a bonus feature, outside the original 90-day contract, and it is built so it costs nothing until the founders choose to open a real store.

## The three modes

| `NEXT_PUBLIC_SHOP_MODE` | What visitors see | Cost |
| --- | --- | --- |
| `off` (default) | No Shop link in the header or footer. `/shop` and `/es/tienda` return 404. Nothing about a shop is in the sitemap. | $0 |
| `demo` | A Shop link and a concept preview: six design renders, no prices, no cart, no checkout, a "Concept preview" note, and the email signup. Search engines are asked not to index it. | $0 |
| `live` | Every Shop link opens the real store at `NEXT_PUBLIC_SHOP_LIVE_URL`, and `/shop` redirects there. | Shopify subscription (see below) |

If `live` is set without a valid `https` URL, the site falls back to `off` and prints a warning in the build log. A typo never exposes a half-built store.

## How to switch (about one minute)

The value is read when the site is built, so changing it needs a redeploy.

1. Open the host's dashboard (Netlify: Site configuration, Environment variables. Vercel: Settings, Environment Variables).
2. Set `NEXT_PUBLIC_SHOP_MODE` to `off`, `demo` or `live`. For `live`, also set `NEXT_PUBLIC_SHOP_LIVE_URL`, for example `https://shop.asc3nd.org`.
3. Choose which environments it applies to (production, previews). A common setup: `demo` on previews so the founders can see it, `off` on production until they decide.
4. Trigger a redeploy.

## From demo to a real store

1. The founders create a Shopify store in ASC3ND's name and connect Printify to it (Printify has an official Shopify integration).
2. Build the storefront from the Vercel Shop template in its own repo (`asc3nd-shop`), restyled to match this site, deployed to `shop.asc3nd.org`.
3. Set `NEXT_PUBLIC_SHOP_MODE=live` and `NEXT_PUBLIC_SHOP_LIVE_URL=https://shop.asc3nd.org`, then redeploy.

Product photos on the real store come from Printify's mockups of the actual print files. The demo images are concept renders and must not be used as product listings.

## What the demo deliberately does not do

- No prices, because none are decided.
- No cart, checkout or payment, so nothing can be bought.
- No claim that purchases fund the organization. Legal and tax status is still an open gate.

## Files

- `lib/shop-config.ts`: reads the switch.
- `lib/nav.ts`: header and footer links follow the switch.
- `lib/shop-demo.ts` and `public/images/shop/demo/`: the concept products and their WebP images.
- `components/ShopView.tsx`, `app/shop-demo.css`: the preview page.
- `app/shop/page.tsx`, `app/es/tienda/page.tsx`: gate each mode.

`lib/printify.ts` and `docs/PRINTIFY.md` are no longer used by the shop pages. Remove them if the Shopify route is chosen.
