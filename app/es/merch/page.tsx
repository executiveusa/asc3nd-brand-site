import Link from "next/link";
import { BrandWordmark } from "@/components/BrandWordmark";
import { LocaleSwitch } from "@/components/LocaleSwitch";
import { listAsc3ndMerch, productImage, productPrice, productPurchaseUrl } from "@/lib/printify";
import "../../merch/merch.css";

export const metadata = {
  title: "Merch | ASC3ND",
  description: "Mercancía de ASC3ND: una forma opcional de apoyar a la organización y representar la misión.",
  alternates: { canonical: "https://asc3nd.org/es/merch", languages: { "en-US": "https://asc3nd.org/merch", "es": "https://asc3nd.org/es/merch" } },
};

export const dynamic = "force-dynamic";

export default async function MerchEsPage() {
  const products = await listAsc3ndMerch();

  return (
    <main id="main-content" tabIndex={-1} lang="es">
      <header className="masthead shell">
        <Link className="wordmark" href="/es" aria-label="Inicio de ASC3ND"><BrandWordmark /></Link>
        <nav className="nav" aria-label="Navegación principal">
          <Link href="/es">Historia</Link>
          <Link href="/es/eventos">Eventos</Link>
          <Link href="/es/participar">Participar</Link>
          <LocaleSwitch locale="es" enHref="/merch" esHref="/es/merch" />
        </nav>
      </header>

      <section className="merch-hero shell">
        <p className="eyebrow">MERCH ASC3ND</p>
        <h1>Lleva la misión.</h1>
        <p>Una colección pequeña construida alrededor de la identidad y comunidad de ASC3ND. Comprar mercancía es una forma opcional de apoyar a la organización y representar la misión.</p>
      </section>

      {products.length ? (
        <section className="merch-grid shell" aria-label="Mercancía ASC3ND">
          {products.map((product) => {
            const image = productImage(product);
            const price = productPrice(product);
            const purchaseUrl = productPurchaseUrl(product);
            return <article className="merch-card" key={product.id}>
              <div className="merch-image">{image ? <img src={image} alt="" loading="lazy" decoding="async" /> : <span>Imagen del producto</span>}</div>
              <div className="merch-copy">
                <div><p className="eyebrow">ASC3ND</p><h2>{product.title ?? "Mercancía ASC3ND"}</h2></div>
                {price ? <p className="merch-price">Desde {price}</p> : null}
                {purchaseUrl ? <a className="merch-link" href={purchaseUrl} rel="noreferrer">Ver este producto <span aria-hidden="true">↗</span></a> : <span className="merch-unavailable">Aún no disponible para compra</span>}
              </div>
            </article>;
          })}
        </section>
      ) : (
        <section className="merch-coming shell">
          <p className="eyebrow">PRÓXIMAMENTE</p>
          <h2>La primera colección de ASC3ND está en preparación.</h2>
          <p>Los productos aparecerán aquí únicamente después de verificar diseños, precios, cumplimiento y compra.</p>
          <Link href="/es/participar">Explora otras formas de participar <span aria-hidden="true">→</span></Link>
        </section>
      )}

      <section className="merch-note shell"><p>Las compras de mercancía no se presentan aquí como donaciones deducibles de impuestos. Los detalles de producción, envío y cumplimiento aparecen con cada producto activo.</p></section>
    </main>
  );
}
