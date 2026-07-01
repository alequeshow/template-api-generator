"use client";

import { useRouter } from "next/navigation";

import { StatusForm } from "@/features/status/components/StatusForm";
import { useCreateStatusMutation } from "@/features/status/hooks/useStatus";

export function StatusCreateCard() {
  const router = useRouter();
  const createMutation = useCreateStatusMutation();

  return (
    <StatusForm
      title="Status creation"
      submitLabel="Create"
      onSubmit={async (payload) => {
        await createMutation.mutateAsync(payload);
        setTimeout(() => {
          router.push("/status");
          router.refresh();
        }, 700);
      }}
    />
  );
}
