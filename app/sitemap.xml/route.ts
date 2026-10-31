import { headers } from "next/headers";
import { routePairs } from "@/lib/i18n";

const CANONICAL_HOSTS = new Set(["asc3nd.org", "www.asc3nd.org"]);



function xmlEscape(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

export async function GET() {
  const host = (await headers()).get("host")?.toLowerCase() ?? "";
  if (!CANONICAL_HOSTS.has(host)) {
    return new Response("Not Found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const base = "https://asc3nd.org";
  // Every English page and its Spanish twin, each listing both as hreflang alternates.
  const alt = (en: string, es: string) => [
    `    <xhtml:link rel="alternate" hreflang="en-US" href="${xmlEscape(base + en)}"/>`,
    `    <xhtml:link rel="alternate" hreflang="es-US" href="${xmlEscape(base + es)}"/>`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(base + en)}"/>`,
  ].join("\n");
  const urls = routePairs
    .flatMap((pair) => [pair.en, pair.es].map((loc) => `  <url>\n    <loc>${xmlEscape(base + loc)}</loc>\n${alt(pair.en, pair.es)}\n  </url>`))
    .join("\n");

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    urls,
    "</urlset>",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
