import { getBackendApiBaseUrl } from "@/shared/bff/server/env";
import type { Dispatcher } from "undici";

const allowSelfSignedCertificatesKey = "ALLOW_SELF_SIGNED_CERTS" as const;
let insecureTlsDispatcher: Dispatcher | undefined;

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

  // Auto-allow for localhost/127.0.0.1/::1 in development
  return isLoopbackHost(target.hostname);
}

async function getBackendDispatcher(target: URL): Promise<Dispatcher | undefined> {
  if (!shouldAllowSelfSignedCertificates(target)) {
    return undefined;
  }

  if (!insecureTlsDispatcher) {
    const { Agent } = await import("undici");
    insecureTlsDispatcher = new Agent({
      connect: {
        rejectUnauthorized: false,
      },
    });
  }

  return insecureTlsDispatcher;
}

export async function callBackend(pathname: string, init?: RequestInit): Promise<Response> {
  const backendUrl = buildBackendUrl(pathname);
  const dispatcher = await getBackendDispatcher(new URL(backendUrl));
  const fetchInit: RequestInit & { dispatcher?: Dispatcher } = {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: init?.cache ?? "no-store",
  };

  if (dispatcher) {
    fetchInit.dispatcher = dispatcher;
  }

  return fetch(backendUrl, fetchInit);
}

export async function readJsonSafe<T>(response: Response): Promise<T | null> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  return (await response.json()) as T;
}
