"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createStatus, deleteStatus, getStatusById, getStatusList, updateStatus } from "@/features/status/api";
import type { StatusItem } from "@/features/status/types";

const statusListQueryKey = ["status", "list"] as const;

export function useStatusListQuery() {
  return useQuery({
    queryKey: statusListQueryKey,
    queryFn: getStatusList,
  });
}

export function useStatusByIdQuery(id: string) {
  return useQuery({
    queryKey: ["status", "item", id],
    queryFn: () => getStatusById(id),
    enabled: id.length > 0,
  });
}

export function useCreateStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: StatusItem) => createStatus(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: statusListQueryKey });
    },
  });
}

export function useUpdateStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: StatusItem }) => updateStatus(id, payload),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: statusListQueryKey }),
        queryClient.invalidateQueries({ queryKey: ["status", "item", variables.id] }),
      ]);
    },
  });
}

export function useDeleteStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteStatus(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: statusListQueryKey });
    },
  });
}
