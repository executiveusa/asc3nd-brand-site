import { ShopView } from "@/components/ShopView";
import { pageMetadata } from "@/lib/metadata";
import { shopEn } from "@/lib/support-shop.en";

export const revalidate = 300;

export const metadata = pageMetadata({
  title: "Shop",
  description: "ASC3ND merchandise: an optional way to support the organization and wear the mission.",
  path: "/shop",
});

export default function ShopPage() {
  return <ShopView copy={shopEn} language="en" />;
}
