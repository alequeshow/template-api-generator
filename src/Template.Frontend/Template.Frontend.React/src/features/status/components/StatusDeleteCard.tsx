"use client";

import { useRouter } from "next/navigation";

import { StatusForm } from "@/features/status/components/StatusForm";
import { useDeleteStatusMutation, useStatusByIdQuery } from "@/features/status/hooks/useStatus";

type StatusDeleteCardProps = {
  id: string;
};

export function StatusDeleteCard({ id }: StatusDeleteCardProps) {
  const router = useRouter();
  const statusQuery = useStatusByIdQuery(id);
  const deleteMutation = useDeleteStatusMutation();

  if (statusQuery.isLoading) {
    return <p>Loading...</p>;
  }

  if (statusQuery.isError || !statusQuery.data) {
    return <p>Status not found.</p>;
  }

  return (
    <StatusForm
      title="Status deletion"
      submitLabel="Delete"
      initialValue={statusQuery.data}
      readOnly
      onSubmit={async () => {
        await deleteMutation.mutateAsync(id);
        setTimeout(() => {
          router.push("/status");
          router.refresh();
        }, 700);
      }}
    />
  );
}
