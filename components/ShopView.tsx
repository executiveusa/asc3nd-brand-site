import Link from "next/link";
import { CommunitySignup } from "@/components/CommunitySignup";
import { InteriorPage } from "@/components/InteriorPage";
import { listAsc3ndMerch, productImage, productPrice, productPurchaseUrl } from "@/lib/printify";
import type { ShopCopy } from "@/lib/support-shop.en";
import "@/app/home.css";
import "@/app/support-shop.css";

export async function ShopView({ copy, language }: { copy: ShopCopy; language: "en" | "es" }) {
  const products = await listAsc3ndMerch();
  const sourcePage = language === "es" ? "asc3nd.org/es/tienda" : "asc3nd.org/shop";

  return (
    <InteriorPage eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro}>
      {products.length ? (
        <section className="interior-section shell" aria-label={copy.gridLabel}>
          <ul className="shop-grid">
            {products.map((product) => {
              const image = productImage(product);
              const price = productPrice(product);
              const href = productPurchaseUrl(product);
              if (!href) return null;
              return (
                <li className="shop-card" key={product.id}>
                  <div className="shop-image">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {image ? <img src={image} alt={product.title ?? copy.fallbackTitle} loading="lazy" decoding="async" /> : null}
                  </div>
                  <h2>{product.title ?? copy.fallbackTitle}</h2>
                  {price ? <p className="shop-price">{copy.from} {price}</p> : null}
                  <a className="ss-action" href={href} target="_blank" rel="noopener noreferrer">
                    {copy.buy} <span className="arrow" aria-hidden="true">↗</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      ) : (
        <>
          <section className="interior-statement shell shop-soon" aria-labelledby="shop-soon-title">
            <p className="eyebrow">{copy.soon.eyebrow}</p>
            <h2 id="shop-soon-title">{copy.soon.title}</h2>
            <p>{copy.soon.body}</p>
            <p><Link className="text-link" href={copy.soon.href}>{copy.soon.link} <span className="arrow" aria-hidden="true">→</span></Link></p>
          </section>
          <CommunitySignup copy={copy.signup} language={language} sourcePage={sourcePage} />
        </>
      )}
    </InteriorPage>
  );
}
