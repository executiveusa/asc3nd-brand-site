/**
 * The shop switch. One value decides whether a shop exists on the public site.
 *
 *   off   no Shop link anywhere; /shop and /es/tienda return 404.        (default)
 *   demo  concept preview with mock products. Nothing is for sale; no cart, no checkout.
 *   live  every Shop link goes to the real store at NEXT_PUBLIC_SHOP_LIVE_URL.
 *
 * Both values are read at build time, so changing one means a redeploy (about a minute).
 * A "live" value without a valid https URL falls back to "off" so a typo never exposes a half-built store.
 */
export type ShopMode = "off" | "demo" | "live";

const requested = (process.env.NEXT_PUBLIC_SHOP_MODE ?? "off").trim().toLowerCase();
const liveUrl = (process.env.NEXT_PUBLIC_SHOP_LIVE_URL ?? "").trim();

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export const shopMode: ShopMode =
  requested === "demo" ? "demo" : requested === "live" && isHttpsUrl(liveUrl) ? "live" : "off";

export const shopLiveUrl = shopMode === "live" ? liveUrl : "";

if (typeof window === "undefined" && requested === "live" && shopMode !== "live") {
  console.warn("NEXT_PUBLIC_SHOP_MODE=live needs NEXT_PUBLIC_SHOP_LIVE_URL set to an https URL. The shop stays off.");
}
