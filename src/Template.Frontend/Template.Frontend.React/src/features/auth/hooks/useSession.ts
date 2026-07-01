"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getSession, login, logout, refreshSession } from "@/shared/auth/client";
import type { UserCredentialsRequest } from "@/shared/auth/contracts";

export const sessionQueryKey = ["session"] as const;

export function useSessionQuery() {
  return useQuery({
    queryKey: sessionQueryKey,
    queryFn: getSession,
    retry: false,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: UserCredentialsRequest) => login(credentials),
    onSuccess: (session) => {
      queryClient.setQueryData(sessionQueryKey, session);
    },
  });
}

export function useRefreshMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refreshSession,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: sessionQueryKey });
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSettled: async () => {
      queryClient.setQueryData(sessionQueryKey, { state: "anonymous" });
      await queryClient.invalidateQueries({ queryKey: sessionQueryKey });
    },
  });
}
