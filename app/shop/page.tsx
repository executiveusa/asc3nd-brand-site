import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ShopView } from "@/components/ShopView";
import { pageMetadata } from "@/lib/metadata";
import { shopLiveUrl, shopMode } from "@/lib/shop-config";
import { shopEn } from "@/lib/support-shop.en";

// A concept preview is not a store, so search engines are asked to skip it.
export const metadata: Metadata = {
  ...pageMetadata({
    title: "Shop",
    description: "A preview of an ASC3ND shop. Concepts only; nothing is for sale yet.",
    path: "/shop",
  }),
  robots: { index: false, follow: true },
};

export default function ShopPage() {
  if (shopMode === "off") notFound();
  if (shopMode === "live") redirect(shopLiveUrl);
  return <ShopView copy={shopEn} language="en" />;
}
