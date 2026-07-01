import { NextRequest, NextResponse } from "next/server";

import { assertCsrfToken } from "@/shared/bff/server/cookies";
import { callBackendAuthorized, toProxyResponse } from "@/shared/bff/server/proxyAuth";

export async function GET(request: NextRequest) {
  const { response, updatedTokens } = await callBackendAuthorized(request, "/status", {
    method: "GET",
  });

  return toProxyResponse(response, updatedTokens);
}

export async function POST(request: NextRequest) {
  const csrfError = assertCsrfToken(request);

  if (csrfError) {
    return NextResponse.json({ message: csrfError }, { status: 403 });
  }

  const payload = await request.text();

  const { response, updatedTokens } = await callBackendAuthorized(request, "/status", {
    method: "POST",
    body: payload,
  });

  return toProxyResponse(response, updatedTokens);
}
