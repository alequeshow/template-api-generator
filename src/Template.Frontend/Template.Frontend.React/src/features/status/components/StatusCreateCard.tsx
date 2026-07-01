"use client";

import { useRouter } from "next/navigation";

import { REDIRECT_DELAY_MS } from "@/features/status/constants";
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
        }, REDIRECT_DELAY_MS);
      }}
    />
  );
}
