import { NextRequest, NextResponse } from "next/server";

import { assertCsrfToken } from "@/shared/bff/server/cookies";
import { callBackendAuthorized, toProxyResponse } from "@/shared/bff/server/proxyAuth";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;

  const { response, updatedTokens } = await callBackendAuthorized(request, `/status/${id}`, {
    method: "GET",
  });

  return toProxyResponse(response, updatedTokens);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const csrfError = assertCsrfToken(request);

  if (csrfError) {
    return NextResponse.json({ message: csrfError }, { status: 403 });
  }

  const payload = await request.text();
  const { id } = await params;

  const { response, updatedTokens } = await callBackendAuthorized(request, `/status/${id}`, {
    method: "PUT",
    body: payload,
  });

  return toProxyResponse(response, updatedTokens);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const csrfError = assertCsrfToken(request);

  if (csrfError) {
    return NextResponse.json({ message: csrfError }, { status: 403 });
  }

  const { id } = await params;

  const { response, updatedTokens } = await callBackendAuthorized(request, `/status/${id}`, {
    method: "DELETE",
  });

  return toProxyResponse(response, updatedTokens);
}
