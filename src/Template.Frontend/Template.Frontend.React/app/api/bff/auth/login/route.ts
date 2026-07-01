import { NextRequest, NextResponse } from "next/server";

import { callBackend, readJsonSafe } from "@/shared/bff/server/backendClient";
import { applyTokenCookies, ensureCsrfCookie } from "@/shared/bff/server/cookies";
import type { TokenAuthenticationResult, UserCredentialsRequest, UserInfo } from "@/shared/auth/contracts";

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as UserCredentialsRequest;

  const loginResponse = await callBackend("/auth/token", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!loginResponse.ok) {
    const body = await loginResponse.text();
    return new NextResponse(body, { status: loginResponse.status });
  }

  const tokenResult = await readJsonSafe<TokenAuthenticationResult>(loginResponse);

  if (!tokenResult?.token || !tokenResult.refreshToken) {
    return NextResponse.json({ message: "Invalid login response" }, { status: 502 });
  }

  const userInfoResponse = await callBackend("/auth/userinfo", {
    method: "POST",
    headers: {
      authorization: "Bearer " + tokenResult.token,
    },
  });

  const userInfo = await readJsonSafe<UserInfo>(userInfoResponse);

  const response = NextResponse.json({ user: userInfo }, { status: 200 });
  applyTokenCookies(response, tokenResult);
  ensureCsrfCookie(response);

  return response;
}
