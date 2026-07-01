import { bffEndpoints } from "@/shared/bff/endpoints";

import type { StatusItem } from "@/features/status/types";

function readCsrfTokenFromDocument() {
  if (typeof document === "undefined") {
    return "";
  }

  const csrfCookie = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("tg_csrf_token="));

  return csrfCookie?.split("=")[1] ?? "";
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      "content-type": "application/json",
      ...(init?.method && init.method !== "GET" ? { "x-csrf-token": readCsrfTokenFromDocument() } : {}),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function getStatusList() {
  return apiRequest<StatusItem[]>(bffEndpoints.status, { method: "GET" });
}

export function getStatusById(id: string) {
  return apiRequest<StatusItem>(`${bffEndpoints.status}/${id}`, { method: "GET" });
}

export function createStatus(payload: StatusItem) {
  return apiRequest<string>(bffEndpoints.status, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateStatus(id: string, payload: StatusItem) {
  return apiRequest<void>(`${bffEndpoints.status}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteStatus(id: string) {
  return apiRequest<void>(`${bffEndpoints.status}/${id}`, {
    method: "DELETE",
  });
}
