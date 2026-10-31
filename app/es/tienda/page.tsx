import { ShopView } from "@/components/ShopView";
import { pageMetadata } from "@/lib/metadata";
import { shopEs } from "@/lib/support-shop.es";

export const revalidate = 300;

export const metadata = pageMetadata({
  title: "Tienda",
  description: "Mercancía de ASC3ND: una forma opcional de apoyar a la organización y llevar la misión.",
  path: "/es/tienda",
});

export default function TiendaPage() {
  return <ShopView copy={shopEs} language="es" />;
}
