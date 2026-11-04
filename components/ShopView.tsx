import { CommunitySignup } from "@/components/CommunitySignup";
import { InteriorPage } from "@/components/InteriorPage";
import { shopDemoProducts } from "@/lib/shop-demo";
import type { ShopCopy } from "@/lib/support-shop.en";
import "@/app/home.css";
import "@/app/support-shop.css";
import "@/app/shop-demo.css";

/** Concept preview of the shop. No prices, no cart, no checkout: nothing here can be bought. */
export function ShopView({ copy, language }: { copy: ShopCopy; language: "en" | "es" }) {
  const sourcePage = language === "es" ? "asc3nd.org/es/tienda" : "asc3nd.org/shop";

  return (
    <InteriorPage eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro}>
      <section className="interior-section shell shop-demo" aria-label={copy.gridLabel}>
        <p className="shop-demo-note">
          <span className="shop-demo-chip">{copy.demo.chip}</span>
          <span>{copy.demo.note}</span>
        </p>
        <ul className="shop-demo-grid">
          {shopDemoProducts.map((product) => (
            <li className="shop-demo-card" key={product.id}>
              <div className="shop-demo-image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/images/shop/demo/${product.id}-1254.webp`}
                  srcSet={`/images/shop/demo/${product.id}-640.webp 640w, /images/shop/demo/${product.id}-1254.webp 1254w`}
                  sizes="(max-width: 820px) 46vw, 30vw"
                  alt={product.alt[language]}
                  width={1254}
                  height={1254}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <h2>{product.name[language]}</h2>
              <p className="shop-demo-state">{copy.demo.state}</p>
            </li>
          ))}
        </ul>
      </section>
      <CommunitySignup copy={copy.signup} language={language} sourcePage={sourcePage} />
    </InteriorPage>
  );
}
