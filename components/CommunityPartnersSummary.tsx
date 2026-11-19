/**
 * Founder-confirmed community appreciation from Otha and Elisha.
 * The first-party logo files are client-supplied, not sourced from the web.
 * All 13 optimized original-source logo images are now committed on this branch.
 * An organization appearing here is NOT an asserted sponsor of a specific event.
 */
const organizations = [
  { name: "Greater Seattle Restoration", file: "greater-seattle-restoration.webp" },
  { name: "MACS Digital Media", file: "macs-digital-media.webp" },
  { name: "ARTCO Sign Company", file: "artco-sign-company.webp" },
  { name: "NW Gold Star", file: "nw-gold-star.webp" },
  { name: "Family and That’s All Incorporated", file: "family-and-thats-all.webp" },
  { name: "New Beginnings", file: "new-beginnings.webp" },
  { name: "Tangles & Locs", file: "tangles-and-locs.webp" },
  { name: "Thrivent", file: "thrivent.webp" },
  { name: "Tonmay Productions", file: "tonmay-productions.webp" },
  { name: "Discount Banners & Signs", file: "discount-banners-and-signs.webp" },
  { name: "Alliance Flooring Services", file: "alliance-flooring-services.webp" },
  { name: "Avenue5 Residential", file: "avenue5-residential.webp" },
  { name: "Planet Mynd", file: "planet-mynd.webp" },
] as const;

export function CommunityPartnersSummary({ locale = "en" }: { locale?: "en" | "es" }) {
  const es = locale === "es";
  return (
    <section className="shell community-partners-summary" aria-labelledby="community-partners-summary-title">
      <p className="eyebrow">{es ? "Agradecimiento a nuestra comunidad" : "Community Appreciation"}</p>
      <h2 id="community-partners-summary-title">
        {es ? "Gracias por ayudarnos a marcar la diferencia" : "Thank you for helping us make a difference"}
      </h2>
      <p>{es
        ? "Agradecemos a las organizaciones que han colaborado con ASC3ND de distintas maneras."
        : "We appreciate the organizations that have partnered with ASC3ND in different ways."}</p>
      <ul className="community-partners-names">
        {organizations.map(({ name, file }) => (
          <li key={name} className="community-partner-with-logo">
            <img src={`/images/partners/${file}`} alt={name} width={260} height={120} loading="lazy" decoding="async" />
          </li>
        ))}
      </ul>
      <p className="community-partners-thanks">{es
        ? "Gracias a todas las organizaciones, empresas y personas que han apoyado nuestra misión."
        : "Thank you to every organization, business, and individual who has supported our mission."}</p>
    </section>
  );
}
