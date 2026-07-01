import { type NextRequest, NextResponse } from "next/server";

import { authCookieNames } from "@/shared/bff/cookies";
import type { TokenAuthenticationResult } from "@/shared/auth/contracts";

const oneDayInSeconds = 60 * 60 * 24;

function isProductionEnv() {
  return process.env.NODE_ENV === "production";
}

function toMaxAge(expiresAt?: string) {
  if (!expiresAt) {
    return oneDayInSeconds;
  }

  const expiresAtMs = new Date(expiresAt).getTime();
  if (Number.isNaN(expiresAtMs)) {
    return oneDayInSeconds;
  }

  const seconds = Math.floor((expiresAtMs - Date.now()) / 1000);
  if (seconds <= 0) {
    return 0;
  }

  return seconds;
}

export function ensureCsrfCookie(response: NextResponse) {
  const existing = response.cookies.get(authCookieNames.csrfToken);

  if (existing?.value) {
    return;
  }

  response.cookies.set(authCookieNames.csrfToken, crypto.randomUUID(), {
    httpOnly: false,
    secure: isProductionEnv(),
    sameSite: "lax",
    path: "/",
    maxAge: oneDayInSeconds,
  });
}

export function applyTokenCookies(response: NextResponse, tokenResult: TokenAuthenticationResult) {
  if (!tokenResult.token || !tokenResult.refreshToken) {
    return;
  }

  const maxAge = toMaxAge(tokenResult.expiresAt);

  response.cookies.set(authCookieNames.accessToken, tokenResult.token, {
    httpOnly: true,
    secure: isProductionEnv(),
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  response.cookies.set(authCookieNames.refreshToken, tokenResult.refreshToken, {
    httpOnly: true,
    secure: isProductionEnv(),
    sameSite: "lax",
    path: "/",
    maxAge: oneDayInSeconds * 7,
  });
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.delete(authCookieNames.accessToken);
  response.cookies.delete(authCookieNames.refreshToken);
}

export function getTokenCookies(request: NextRequest) {
  return {
    token: request.cookies.get(authCookieNames.accessToken)?.value,
    refreshToken: request.cookies.get(authCookieNames.refreshToken)?.value,
  };
}

export function assertCsrfToken(request: NextRequest): string | null {
  const csrfCookie = request.cookies.get(authCookieNames.csrfToken)?.value;
  const csrfHeader = request.headers.get("x-csrf-token");

  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    return "Invalid CSRF token";
  }

  return null;
}
