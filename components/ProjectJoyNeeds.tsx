import { projectJoy } from "@/lib/initiative-content";

type Locale = "en" | "es";

/** Matrix generated from the client-provided Amazon QR destination. No remote QR service. */
const qrHex = [
"1fc235597f","1046220b41","175b07915d","17514f0f5d","175597295d",
"1057a55741","1fd555557f","0019221200","17ccc5f77c","0a2cb80d8e",
"1d6fc97ffb","012850e781","13d9c97cfb","102a3fe9a3","1974298fbb",
"043e3ce7b2","1bd272bdc5","18312ddcaa","0741724fd3","1d3e67c189",
"0bcaea58d4","07ae333189","18dde44b7b","071cb10631","08d9a7ffe4",
"138af02b20","10f7cd9eef","151810f1a3","14c51c5ff9","001d8feb19",
"1fcbe88157","105fcce118","175872aff7","17566de35d","1759ba090f",
"104723d7d9","1fdbbe5cd7",
];
const qrPath = qrHex.flatMap((row, y) => {
  // 37-bit QR rows fit safely in a JavaScript number; avoid BigInt literals
  // because the existing repository TypeScript target is ES2017.
  const bits = Number.parseInt(row, 16).toString(2).padStart(37, "0");
  return Array.from({ length: 37 }, (_, x) =>
    bits[x] === "1" ? `M${x + 4} ${y + 4}h1v1h-1z` : ""
  ).filter(Boolean);
}).join("");

const needs = {
  en: [
    { label: "Electronics & Accessories", items: ["Wireless earbuds or Bluetooth headphones", "Kindle e-readers or tablets", "Rechargeable electric hand warmers"] },
    { label: "Clothing & Accessories", items: ["New adult jackets (sizes Small–XXL)", "New shoes for kids and teens (ages 7–18)", "Lip balm (ChapStick)", "Quality reusable water bottles"] },
    { label: "Household Essentials", items: ["Cleaning sponges", "Paper towels", "Bath towels"] },
    { label: "Personal Hygiene", items: ["Shampoo and conditioner", "Deodorant", "Toothbrushes", "Toothpaste"] },
  ],
  es: [
    { label: "Electrónica y accesorios", items: ["Audífonos inalámbricos o Bluetooth", "Lectores Kindle o tabletas", "Calentadores de manos eléctricos recargables"] },
    { label: "Ropa y accesorios", items: ["Chaquetas nuevas para adultos (tallas S–XXL)", "Zapatos nuevos para niños y adolescentes (de 7 a 18 años)", "Bálsamo labial (ChapStick)", "Botellas de agua reutilizables de buena calidad"] },
    { label: "Artículos esenciales para el hogar", items: ["Esponjas de limpieza", "Toallas de papel", "Toallas de baño"] },
    { label: "Higiene personal", items: ["Champú y acondicionador", "Desodorante", "Cepillos de dientes", "Pasta dental"] },
  ],
} as const;

export function ProjectJoyNeeds({ locale }: { locale: Locale }) {
  const c = projectJoy[locale];
  return (
    <section className="project-evidence shell joy-needs" aria-labelledby="joy-needs-heading">
      <h2 id="joy-needs-heading">{c.needsTitle}</h2>
      <p className="joy-needs-intro">{c.needsIntro}</p>
      <div className="joy-needs-grid">
        {needs[locale].map(group => (
          <section key={group.label} className="joy-needs-group" aria-label={group.label}>
            <h3>{group.label}</h3>
            <ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul>
          </section>
        ))}
      </div>
      <p className="joy-needs-footnote">{c.needsFootnote}</p>
      <div className="joy-wishlist-qr">
        <div className="joy-wishlist-qr-art">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" role="img"
            aria-label={locale === "es" ? "Código QR para la lista de deseos de Amazon" : "QR code for the Amazon wish list"}>
            <rect width="45" height="45" fill="#fff" />
            <path fill="#111" d={qrPath} />
          </svg>
        </div>
        <div>
          <h3>{c.qrTitle}</h3>
          <p>{c.qrCopy}</p>
          <a className="joy-support-link" href={projectJoy.wishlistUrl} target="_blank" rel="noopener noreferrer">
            {c.wishlistAction} <span aria-hidden="true">↗</span>
          </a>
          <p className="joy-link-note">{c.wishlistNote}</p>
        </div>
      </div>
    </section>
  );
}
