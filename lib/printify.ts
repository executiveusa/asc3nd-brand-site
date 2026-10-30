const PRINTIFY_API_BASE = "https://api.printify.com/v1";

export type PrintifyVariant = {
  id: number;
  title?: string;
  sku?: string;
  price?: number;
  is_enabled?: boolean;
  is_available?: boolean;
};

export type PrintifyImage = {
  src?: string;
  is_default?: boolean;
  variant_ids?: number[];
};

export type PrintifyProduct = {
  id: string;
  title?: string;
  description?: string;
  visible?: boolean;
  status?: string;
  variants?: PrintifyVariant[];
  images?: PrintifyImage[];
  external?: { id?: string; handle?: string; url?: string };
  sales_channel_properties?: { storefront?: { url?: string } };
};

type ProductListResponse = PrintifyProduct[] | { data?: PrintifyProduct[] };

function config() {
  const token = process.env.PRINTIFY_API_TOKEN ?? process.env.PRINTIFY_API_KEY;
  const shopId = process.env.PRINTIFY_SHOP_ID;
  return token && shopId ? { token, shopId } : null;
}

async function request<T>(path: string): Promise<T | null> {
  const current = config();
  if (!current) return null;

  const response = await fetch(`${PRINTIFY_API_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${current.token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    console.warn(`Printify request failed: ${response.status} ${response.statusText}`);
    return null;
  }

  return response.json() as Promise<T>;
}

function active(product: PrintifyProduct) {
  if (product.visible === false) return false;
  if (product.status?.toLowerCase() === "archived") return false;
  return true;
}

export async function listAsc3ndMerch(): Promise<PrintifyProduct[]> {
  const current = config();
  if (!current) return [];

  const response = await request<ProductListResponse>(
    `/shops/${encodeURIComponent(current.shopId)}/products.json`,
  );
  if (!response) return [];

  const products = Array.isArray(response) ? response : response.data ?? [];
  return products.filter(active);
}

export function productPrice(product: PrintifyProduct): string | null {
  const prices = (product.variants ?? [])
    .filter((variant) => variant.is_enabled !== false && variant.is_available !== false)
    .map((variant) => variant.price)
    .filter((value): value is number => typeof value === "number");

  if (!prices.length) return null;
  const cents = Math.min(...prices);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function productImage(product: PrintifyProduct): string | null {
  return product.images?.find((image) => image.is_default)?.src
    ?? product.images?.find((image) => image.src)?.src
    ?? null;
}

export function productPurchaseUrl(product: PrintifyProduct): string | null {
  return product.sales_channel_properties?.storefront?.url
    ?? product.external?.url
    ?? (product.external?.handle ? `https://printify.me/products/${product.external.handle}` : null);
}
