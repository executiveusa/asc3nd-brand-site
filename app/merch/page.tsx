import Link from "next/link";
import { BrandWordmark } from "@/components/BrandWordmark";
import { listAsc3ndMerch, productImage, productPrice, productPurchaseUrl } from "@/lib/printify";
import "./merch.css";

export const metadata = {
  title: "Merch | ASC3ND",
  description: "ASC3ND merchandise: an optional way to support the organization and represent the mission.",
};

export const dynamic = "force-dynamic";

export default async function MerchPage() {
  const products = await listAsc3ndMerch();

  return (
    <main id="main-content" tabIndex={-1}>
      <header className="masthead shell">
        <Link className="wordmark" href="/" aria-label="ASC3ND home"><BrandWordmark /></Link>
        <nav className="nav" aria-label="Primary navigation">
          <Link href="/story">Story</Link>
          <Link href="/events">Events</Link>
          <Link href="/take-part">Take part</Link>
        </nav>
      </header>

      <section className="merch-hero shell">
        <p className="eyebrow">ASC3ND MERCH</p>
        <h1>Wear the mission.</h1>
        <p>
          A small collection built around ASC3ND's identity and community.
          Purchasing merchandise is one optional way to support the organization and represent the mission.
        </p>
      </section>

      {products.length ? (
        <section className="merch-grid shell" aria-label="ASC3ND merchandise">
          {products.map((product) => {
            const image = productImage(product);
            const price = productPrice(product);
            const purchaseUrl = productPurchaseUrl(product);

            return (
              <article className="merch-card" key={product.id}>
                <div className="merch-image">
                  {image ? <img src={image} alt="" loading="lazy" decoding="async" /> : <span>Product image</span>}
                </div>
                <div className="merch-copy">
                  <div>
                    <p className="eyebrow">ASC3ND</p>
                    <h2>{product.title ?? "ASC3ND merchandise"}</h2>
                  </div>
                  {price ? <p className="merch-price">From {price}</p> : null}
                  {purchaseUrl ? (
                    <a className="merch-link" href={purchaseUrl} rel="noreferrer">
                      Shop this item <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <span className="merch-unavailable">Not yet available for checkout</span>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="merch-coming shell">
          <p className="eyebrow">COMING SOON</p>
          <h2>The first ASC3ND capsule is being prepared.</h2>
          <p>
            Products will appear here only after designs, pricing, fulfillment, and checkout are verified.
          </p>
          <Link href="/take-part">Explore other ways to take part <span aria-hidden="true">→</span></Link>
        </section>
      )}

      <section className="merch-note shell">
        <p>
          Merchandise purchases are not represented here as tax-deductible donations.
          Fulfillment and shipping details are provided with each live product.
        </p>
      </section>
    </main>
  );
}
