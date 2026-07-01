import { getBackendApiBaseUrl } from "@/shared/bff/server/env";

const allowSelfSignedCertificatesKey = "ALLOW_SELF_SIGNED_CERTS" as const;

function buildBackendUrl(pathname: string) {
  return new URL(pathname, getBackendApiBaseUrl()).toString();
}

function isEnabled(value: string | undefined) {
  if (!value) {
    return false;
  }

  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}

function isLoopbackHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

function shouldAllowSelfSignedCertificates(target: URL) {
  if (process.env.NODE_ENV === "production" || target.protocol !== "https:") {
    return false;
  }

  const explicitSetting = process.env[allowSelfSignedCertificatesKey];
  if (explicitSetting !== undefined) {
    return isEnabled(explicitSetting);
  }

  return isLoopbackHost(target.hostname);
}

function configureTlsForBackend(targetUrl: string) {
  const target = new URL(targetUrl);

  if (!shouldAllowSelfSignedCertificates(target)) {
    return;
  }

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function callBackend(pathname: string, init?: RequestInit): Promise<Response> {
  const backendUrl = buildBackendUrl(pathname);
  configureTlsForBackend(backendUrl);

  return fetch(backendUrl, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: init?.cache ?? "no-store",
  });
}

export async function readJsonSafe<T>(response: Response): Promise<T | null> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  return (await response.json()) as T;
}
