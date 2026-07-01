import { type NextRequest, NextResponse } from "next/server";

import { callBackend, readJsonSafe } from "@/shared/bff/server/backendClient";
import { applyTokenCookies, getTokenCookies } from "@/shared/bff/server/cookies";
import type { RefreshTokenRequest, TokenAuthenticationResult } from "@/shared/auth/contracts";

type AuthProxyResult = {
  response: Response;
  updatedTokens?: TokenAuthenticationResult;
};
const hopByHopHeaders = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

function buildProxyHeaders(backendResponse: Response, hasBody: boolean) {
  const headers = new Headers();

  backendResponse.headers.forEach((value, key) => {
    const normalized = key.toLowerCase();

    if (hopByHopHeaders.has(normalized)) {
      return;
    }

    if (!hasBody && (normalized === "content-type" || normalized === "content-length")) {
      return;
    }

    headers.append(key, value);
  });

  return headers;
}

async function refreshTokens(request: NextRequest): Promise<TokenAuthenticationResult | null> {
  const { token, refreshToken } = getTokenCookies(request);

  if (!token || !refreshToken) {
    return null;
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
    return null;
  }

  return readJsonSafe<TokenAuthenticationResult>(refreshResponse);
}

export async function callBackendAuthorized(
  request: NextRequest,
  pathname: string,
  init: RequestInit,
): Promise<AuthProxyResult> {
  const { token } = getTokenCookies(request);

  const callWithToken = async (accessToken?: string) =>
    callBackend(pathname, {
      ...init,
      headers: {
        ...(init.headers ?? {}),
        ...(accessToken ? { authorization: "Bearer " + accessToken } : {}),
      },
    });

  const initialResponse = await callWithToken(token);

  if (initialResponse.status !== 401) {
    return { response: initialResponse };
  }

  const refreshed = await refreshTokens(request);

  if (!refreshed?.token) {
    return { response: initialResponse };
  }

  const retriedResponse = await callWithToken(refreshed.token);

  return {
    response: retriedResponse,
    updatedTokens: refreshed,
  };
}

export async function toProxyResponse(
  backendResponse: Response,
  updatedTokens?: TokenAuthenticationResult,
): Promise<NextResponse> {
  const isNoContentStatus = backendResponse.status === 204 || backendResponse.status === 205;
  const body = isNoContentStatus ? null : await backendResponse.text();
  const headers = buildProxyHeaders(backendResponse, body !== null);

  const response = new NextResponse(body, {
    status: backendResponse.status,
    headers,
  });

  if (updatedTokens) {
    applyTokenCookies(response, updatedTokens);
  }

  return response;
}
