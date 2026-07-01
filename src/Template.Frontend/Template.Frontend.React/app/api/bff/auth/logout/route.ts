import { NextRequest, NextResponse } from "next/server";

import { callBackendAuthorized } from "@/shared/bff/server/proxyAuth";
import { assertCsrfToken, clearAuthCookies } from "@/shared/bff/server/cookies";

export async function POST(request: NextRequest) {
  const csrfError = assertCsrfToken(request);

  if (csrfError) {
    return NextResponse.json({ message: csrfError }, { status: 403 });
  }

  const { response: backendResponse } = await callBackendAuthorized(request, "/auth/token/revoke", {
    method: "POST",
  });

  const response = new NextResponse(null, {
    status: backendResponse.ok ? 204 : backendResponse.status,
  });

  clearAuthCookies(response);

  return response;
}
