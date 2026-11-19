/** Client-confirmed community recognition from Otha and Elisha's Nov 18 message.
 * All listed organizations partnered with ASC3ND in some form; no sponsorship
 * tier, specific event attribution, or endorsement is inferred.
 * Logo source: Logos.docx supplied by client; original image upload remains
 * a separate asset task. Names are visible now without broken image links.
 */
const organizations = [
  "Greater Seattle Restoration",
  "MACS Digital Media",
  "ARTCO Sign Company",
  "NW Gold Star",
  "Family and That’s All Incorporated",
  "New Beginnings",
  "Tangles & Locs",
  "Thrivent",
  "Tonmay Productions",
  "Discount Banners & Signs",
  "Alliance Flooring Services",
  "Avenue5 Residential",
  "Planet Mynd",
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
        {organizations.map(name => <li key={name}>{name}</li>)}
      </ul>
      <p className="community-partners-thanks">{es
        ? "Gracias a todas las organizaciones, empresas y personas que han apoyado nuestra misión."
        : "Thank you to every organization, business, and individual who has supported our mission."}</p>
    </section>
  );
}
