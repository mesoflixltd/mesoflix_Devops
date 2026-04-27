import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const canonicalHost = "tradermind.site";

  // Institutional Domain Enforcement
  // If the request comes from a Netlify temporary domain, force a 301 redirect to the master domain
  if (host && (host.includes(".netlify.app") || host.includes("mesoflixdevops.netlify.app"))) {
    const url = request.nextUrl.clone();
    url.host = canonicalHost;
    url.protocol = protocol;
    
    // Preserve path and query parameters during the handshake
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, manifest.json (etc)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json).*)",
  ],
};
