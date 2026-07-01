import { NextRequest, NextResponse } from "next/server";

import { callBackend, readJsonSafe } from "@/shared/bff/server/backendClient";
import { applyTokenCookies, assertCsrfToken, getTokenCookies } from "@/shared/bff/server/cookies";
import type { RefreshTokenRequest, TokenAuthenticationResult } from "@/shared/auth/contracts";

export async function POST(request: NextRequest) {
  const csrfError = assertCsrfToken(request);

  if (csrfError) {
    return NextResponse.json({ message: csrfError }, { status: 403 });
  }

  const { token, refreshToken } = getTokenCookies(request);

  if (!token || !refreshToken) {
    return NextResponse.json({ message: "Session not found" }, { status: 401 });
  }

  const payload: RefreshTokenRequest = {
    token,
    refreshToken,
  };

  const refreshResponse = await callBackend("/auth/token/refresh", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!refreshResponse.ok) {
    const body = await refreshResponse.text();
    return new NextResponse(body, { status: refreshResponse.status });
  }

  const tokenResult = await readJsonSafe<TokenAuthenticationResult>(refreshResponse);

  if (!tokenResult) {
    return NextResponse.json({ message: "Invalid refresh response" }, { status: 502 });
  }

  const response = NextResponse.json(tokenResult, { status: 200 });
  applyTokenCookies(response, tokenResult);

  return response;
}
