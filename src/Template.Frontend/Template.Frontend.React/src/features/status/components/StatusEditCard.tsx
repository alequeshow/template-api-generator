"use client";

import { useRouter } from "next/navigation";

import { REDIRECT_DELAY_MS } from "@/features/status/constants";
import { StatusForm } from "@/features/status/components/StatusForm";
import { useStatusByIdQuery, useUpdateStatusMutation } from "@/features/status/hooks/useStatus";

type StatusEditCardProps = {
  id: string;
};

export function StatusEditCard({ id }: StatusEditCardProps) {
  const router = useRouter();
  const statusQuery = useStatusByIdQuery(id);
  const updateMutation = useUpdateStatusMutation();

  if (statusQuery.isLoading) {
    return <p>Loading...</p>;
  }

  if (statusQuery.isError || !statusQuery.data) {
    return <p>Status not found.</p>;
  }

  return (
    <StatusForm
      title="Status update"
      submitLabel="Save"
      initialValue={statusQuery.data}
      onSubmit={async (payload) => {
        await updateMutation.mutateAsync({ id, payload });
        setTimeout(() => {
          router.push("/status");
          router.refresh();
        }, REDIRECT_DELAY_MS);
      }}
    />
  );
}
