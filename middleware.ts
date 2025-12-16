import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for the access token cookie
  const accessToken = request.cookies.get("myreliq_access")?.value;

  // Define paths
  const authPaths = ["/auth/login", "/auth/register"];
  const protectedPaths = ["/dashboard", "/admin"];

  // 1. Redirect authenticated users AWAY from auth pages
  if (accessToken && authPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2. Redirect unauthenticated users AWAY from protected pages
  if (
    !accessToken &&
    protectedPaths.some((path) => pathname.startsWith(path))
  ) {
    const loginUrl = new URL("/auth/login", request.url);
    // Optional: Add a 'next' param to redirect back after login
    // loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
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
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
