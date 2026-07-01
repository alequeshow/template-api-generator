import { bffEndpoints } from "@/shared/bff/endpoints";
import type { SessionInfo } from "@/shared/auth/session";
import type { UserCredentialsRequest } from "@/shared/auth/contracts";
import { readCsrfTokenFromDocument } from "@/shared/utils/csrf";

async function fetchBff(path: string, init?: RequestInit) {
  const response = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      "content-type": "application/json",
      ...(init?.method && init.method !== "GET" ? { "x-csrf-token": readCsrfTokenFromDocument() } : {}),
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function mapAuthenticatedSession(user: {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}): SessionInfo {
  return {
    state: "authenticated",
    user,
  };
}

export async function login(credentials: UserCredentialsRequest): Promise<SessionInfo> {
  const result = (await fetchBff(bffEndpoints.login, {
    method: "POST",
    body: JSON.stringify(credentials),
  })) as { user?: SessionInfo["user"] };

  if (!result.user) {
    throw new Error("Invalid login response");
  }

  return mapAuthenticatedSession(result.user);
}

export async function refreshSession(): Promise<void> {
  await fetchBff(bffEndpoints.refresh, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function logout(): Promise<void> {
  await fetchBff(bffEndpoints.logout, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function getSession(): Promise<SessionInfo> {
  const unauthorizedSession: SessionInfo = { state: "anonymous" };

  const response = await fetch(bffEndpoints.userInfo, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (response.status === 401) {
    return unauthorizedSession;
  }

  if (!response.ok) {
    throw new Error(`Failed to load session: ${response.status}`);
  }

  const user = (await response.json()) as SessionInfo["user"];

  if (!user) {
    return unauthorizedSession;
  }

  return mapAuthenticatedSession(user);
}
