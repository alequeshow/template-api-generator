import { bffEndpoints } from "@/shared/bff/endpoints";
import { readCsrfTokenFromDocument } from "@/shared/utils/csrf";

import type { StatusItem } from "@/features/status/types";

async function performApiRequest(path: string, init?: RequestInit): Promise<Response> {
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

  return response;
}

async function apiRequestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await performApiRequest(path, init);
  if (response.status === 204) {
    throw new Error(`Expected JSON response from ${path} but received no content`);
  }
  return response.json() as Promise<T>;
}

async function apiRequestText(path: string, init?: RequestInit): Promise<string> {
  const response = await performApiRequest(path, init);
  if (response.status === 204) {
    return "";
  }
  return response.text();
}

async function apiRequestNoContent(path: string, init?: RequestInit): Promise<void> {
  await performApiRequest(path, init);
}

export function getStatusList() {
  return apiRequestJson<StatusItem[]>(bffEndpoints.status, { method: "GET" });
}

export function getStatusById(id: string) {
  return apiRequestJson<StatusItem>(`${bffEndpoints.status}/${id}`, { method: "GET" });
}

export function createStatus(payload: StatusItem) {
  return apiRequestText(bffEndpoints.status, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateStatus(id: string, payload: StatusItem) {
  return apiRequestNoContent(`${bffEndpoints.status}/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      ...payload,
      id,
    }),
  });
}

export function deleteStatus(id: string) {
  return apiRequestNoContent(`${bffEndpoints.status}/${id}`, {
    method: "DELETE",
  });
}
