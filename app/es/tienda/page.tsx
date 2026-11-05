import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ShopView } from "@/components/ShopView";
import { pageMetadata } from "@/lib/metadata";
import { shopLiveUrl, shopMode } from "@/lib/shop-config";
import { shopEs } from "@/lib/support-shop.es";

// A concept preview is not a store, so search engines are asked to skip it.
export const metadata: Metadata = {
  ...pageMetadata({
    title: "Tienda",
    description: "Una vista previa de una tienda de ASC3ND. Solo conceptos; todavía no hay nada a la venta.",
    path: "/es/tienda",
  }),
  robots: { index: false, follow: true },
};

export default function ShopPage() {
  if (shopMode === "off") notFound();
  if (shopMode === "live") redirect(shopLiveUrl);
  return <ShopView copy={shopEs} language="es" />;
}
