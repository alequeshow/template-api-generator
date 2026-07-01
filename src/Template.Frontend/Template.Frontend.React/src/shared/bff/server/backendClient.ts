import { getBackendApiBaseUrl } from "@/shared/bff/server/env";

function buildBackendUrl(pathname: string) {
  return new URL(pathname, getBackendApiBaseUrl()).toString();
}

export async function callBackend(pathname: string, init?: RequestInit): Promise<Response> {
  return fetch(buildBackendUrl(pathname), {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
}

export async function readJsonSafe<T>(response: Response): Promise<T | null> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  return (await response.json()) as T;
}
