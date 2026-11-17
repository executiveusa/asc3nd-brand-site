import { NextRequest, NextResponse } from "next/server";
import siteMode from "./config/site-mode.json";

/**
 * Release mode is intentionally committed, not user-editable and not query-string driven.
 * No public mode toggling endpoint. Changing this config requires a reviewed commit
 * (or the gated workflow_dispatch action), then a normal Netlify deployment.
 */
export function proxy(request: NextRequest) {
  if (siteMode.mode !== "standby") return NextResponse.next();
  const { pathname } = request.nextUrl;
  // Keep the intake API, assets and the standalone standby route functional.
  if (
    pathname === "/standby" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/fonts/") ||
    pathname.startsWith("/media/") ||
    pathname === "/favicon.ico" ||
    pathname === "/manifest.json" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) return NextResponse.next();
  // Avoid unapproved public pages being reachable under maintenance mode.
  const url = request.nextUrl.clone();
  url.pathname = "/standby";
  url.search = "";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
