type Props = {
  locale?: "en" | "es";
  enHref: string;
  esHref: string;
};

export function LocaleSwitch({ locale = "en", enHref, esHref }: Props) {
  const href = locale === "en" ? esHref : enHref;
  const label = locale === "en" ? "ES" : "EN";
  const accessible = locale === "en" ? "Ver esta página en español" : "View this page in English";

  return <a className="locale-switch" href={href} aria-label={accessible}>{label}</a>;
}
