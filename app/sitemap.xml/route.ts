import { headers } from "next/headers";

const CANONICAL_HOSTS = new Set(["asc3nd.org", "www.asc3nd.org"]);

const routes = [
  "/",
  "/story",
  "/events",
  "/projects/community-cuts",
  "/take-part",
  "/take-part/family",
  "/take-part/mentor-volunteer",
  "/take-part/partner",
  "/privacy",
  "/youth-safety",
  "/transparency",
] as const;

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
  const urls = routes
    .map((route) => `  <url><loc>${xmlEscape(`${base}${route}`)}</loc></url>`)
    .join("\n");

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
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
