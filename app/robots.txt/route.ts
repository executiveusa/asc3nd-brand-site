import { headers } from "next/headers";

const CANONICAL_HOSTS = new Set(["asc3nd.org", "www.asc3nd.org"]);

export async function GET() {
  const host = (await headers()).get("host")?.toLowerCase() ?? "";
  const isCanonical = CANONICAL_HOSTS.has(host);

  const body = isCanonical
    ? [
        "User-agent: *",
        "Allow: /",
        "Disallow: /staff",
        "Disallow: /admin",
        "Disallow: /api/",
        "",
        "Sitemap: https://asc3nd.org/sitemap.xml",
        "",
      ].join("\n")
    : [
        "User-agent: *",
        "Disallow: /",
        "",
      ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
