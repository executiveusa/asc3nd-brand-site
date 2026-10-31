/**
 * Read-only Printify catalog for the /shop page.
 *
 * Environment (both required, server only, never NEXT_PUBLIC_):
 *   PRINTIFY_API_TOKEN   personal access token or API key from Printify
 *   PRINTIFY_SHOP_ID     numeric shop id (GET /v1/shops.json lists it)
 * Optional:
 *   PRINTIFY_STOREFRONT_URL  https origin of the public store the products are
 *                            published to, used only to complete a relative
 *                            external.handle path into a link.
 *
 * Every failure path returns an empty list. The shop page then shows its
 * "opening soon" state instead of an error or an empty grid.
 */
const PRINTIFY_API_BASE = "https://api.printify.com/v1";
const PAGE_LIMIT = 50; // documented maximum for products.json
const MAX_PAGES = 4;
const TIMEOUT_MS = 8000;
export const SHOP_REVALIDATE_SECONDS = 300;

export type PrintifyVariant = {
  id: number;
  title?: string;
  price?: number; // integer cents
  is_enabled?: boolean;
  is_available?: boolean;
};

export type PrintifyImage = {
  src?: string;
  is_default?: boolean;
};

export type PrintifyProduct = {
  id: string;
  title?: string;
  visible?: boolean;
  variants?: PrintifyVariant[];
  images?: PrintifyImage[];
  external?: { id?: string; handle?: string } | unknown[];
};

type ProductPage = { data?: PrintifyProduct[]; last_page?: number };

function config() {
  const token = process.env.PRINTIFY_API_TOKEN;
  const shopId = process.env.PRINTIFY_SHOP_ID;
  return token && shopId ? { token, shopId } : null;
}

async function fetchPage(shopId: string, token: string, page: number): Promise<ProductPage | null> {
  try {
    const response = await fetch(
      `${PRINTIFY_API_BASE}/shops/${encodeURIComponent(shopId)}/products.json?limit=${PAGE_LIMIT}&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "User-Agent": "asc3nd.org shop (Next.js)",
        },
        next: { revalidate: SHOP_REVALIDATE_SECONDS },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      },
    );
    if (!response.ok) {
      console.warn(`Printify request failed: ${response.status}`);
      return null;
    }
    const body = (await response.json()) as unknown;
    return body && typeof body === "object" ? (body as ProductPage) : null;
  } catch (error) {
    console.warn("Printify unreachable; showing the opening-soon state.", error instanceof Error ? error.message : error);
    return null;
  }
}

function enabledVariants(product: PrintifyProduct) {
  return (product.variants ?? []).filter((v) => v.is_enabled !== false && v.is_available !== false);
}

function isHttps(value: unknown): boolean {
  if (typeof value !== "string") return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Link to the page where the item can be bought, or null. Never guessed.
 * Printify documents external.handle only as "an external reference in the
 * sales channel" (example value: "/path/to/product"), so a relative handle is
 * resolved only against an explicitly configured PRINTIFY_STOREFRONT_URL.
 */
export function productPurchaseUrl(product: PrintifyProduct): string | null {
  const external = product.external;
  const handle = external && !Array.isArray(external) ? external.handle : undefined;
  if (typeof handle !== "string" || !handle) return null;
  if (isHttps(handle)) return handle;
  const origin = process.env.PRINTIFY_STOREFRONT_URL;
  if (handle.startsWith("/") && !handle.startsWith("//") && typeof origin === "string" && isHttps(origin)) {
    return new URL(handle, origin).href;
  }
  return null;
}

export function productPrice(product: PrintifyProduct): string | null {
  const prices = enabledVariants(product)
    .map((v) => v.price)
    .filter((n): n is number => typeof n === "number" && n > 0);
  if (!prices.length) return null;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Math.min(...prices) / 100);
}

export function productImage(product: PrintifyProduct): string | null {
  const image = product.images?.find((i) => i.is_default && isHttps(i.src)) ?? product.images?.find((i) => isHttps(i.src));
  return image?.src ?? null;
}

/** Listed only if a visitor could actually buy it: published, priced, in stock, with a real link. */
function sellable(product: PrintifyProduct) {
  return (
    product.visible !== false &&
    !!product.title &&
    enabledVariants(product).length > 0 &&
    productPrice(product) !== null &&
    productPurchaseUrl(product) !== null
  );
}

export async function listAsc3ndMerch(): Promise<PrintifyProduct[]> {
  const current = config();
  if (!current) return [];
  const products: PrintifyProduct[] = [];
  let last = 1;
  for (let page = 1; page <= Math.min(last, MAX_PAGES); page++) {
    const body = await fetchPage(current.shopId, current.token, page);
    if (!body) return page === 1 ? [] : products.filter(sellable);
    if (Array.isArray(body.data)) products.push(...body.data);
    last = typeof body.last_page === "number" ? body.last_page : 1;
  }
  return products.filter(sellable);
}
