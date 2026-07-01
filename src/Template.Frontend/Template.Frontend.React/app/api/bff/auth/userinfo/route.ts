import { NextRequest, NextResponse } from "next/server";

import { callBackendAuthorized, toProxyResponse } from "@/shared/bff/server/proxyAuth";
import { ensureCsrfCookie } from "@/shared/bff/server/cookies";

export async function GET(request: NextRequest) {
  const { response: backendResponse, updatedTokens } = await callBackendAuthorized(request, "/auth/userinfo", {
    method: "POST",
  });

  if (backendResponse.status === 401) {
    const unauthorized = NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    ensureCsrfCookie(unauthorized);
    return unauthorized;
  }

  const response = await toProxyResponse(backendResponse, updatedTokens);
  ensureCsrfCookie(response);

  return response;
}
