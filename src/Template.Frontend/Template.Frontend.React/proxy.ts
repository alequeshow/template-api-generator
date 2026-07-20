import { NextResponse, type NextRequest } from "next/server";

import { authCookieNames } from "@/shared/bff/cookies";

const protectedPrefixes = ["/auth", "/status"];
const ignoredPrefixes = ["/_next", "/favicon"];
const publicApiRoutes = ["/api/bff/auth/login"];
const csrfCookieMaxAgeSeconds = 60 * 60 * 24;

function isPublicPath(pathname: string) {
  return pathname === "/login";
}

function isProtectedPath(pathname: string) {
  if (pathname === "/") {
    return true;
  }

  return protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    ignoredPrefixes.some((prefix) => pathname.startsWith(prefix)) ||
    publicApiRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(authCookieNames.accessToken)?.value;

  if (!accessToken && isProtectedPath(pathname) && !pathname.startsWith("/api/")) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnTo", pathname);

    const response = NextResponse.redirect(loginUrl);

    if (!request.cookies.get(authCookieNames.csrfToken)?.value) {
      response.cookies.set(authCookieNames.csrfToken, crypto.randomUUID(), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: csrfCookieMaxAgeSeconds,
      });
    }

    return response;
  }

  if (accessToken && isPublicPath(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const response = NextResponse.next();

  if (!request.cookies.get(authCookieNames.csrfToken)?.value) {
    response.cookies.set(authCookieNames.csrfToken, crypto.randomUUID(), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: csrfCookieMaxAgeSeconds,
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
