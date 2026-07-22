"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { STATUS_MODAL_TIMEOUT_MS } from "@/features/status/constants";
import { StatusForm } from "@/features/status/components/StatusForm";
import { useStatusByIdQuery, useUpdateStatusMutation } from "@/features/status/hooks/useStatus";
import { Modal } from "@/shared/ui/Modal";

type StatusEditCardProps = {
  id: string;
};

export function StatusEditCard({ id }: StatusEditCardProps) {
  const router = useRouter();
  const statusQuery = useStatusByIdQuery(id);
  const updateMutation = useUpdateStatusMutation();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  if (statusQuery.isLoading) {
    return <p>Loading...</p>;
  }

  if (statusQuery.isError || !statusQuery.data) {
    return <p>Status not found.</p>;
  }

  return (
    <>
      <StatusForm
        submitLabel="Save"
        initialValue={statusQuery.data}
        onSubmit={(payload) => updateMutation.mutateAsync({ id, payload })}
        onSuccess={() => setShowSuccessModal(true)}
        onError={() => setShowErrorModal(true)}
      />
      <Modal
        open={showSuccessModal}
        variant="success"
        title="Status updated"
        description="The status entry was updated successfully."
        timeoutMs={STATUS_MODAL_TIMEOUT_MS}
        showProgress
        onClose={() => {
          setShowSuccessModal(false);
          router.push("/status");
          router.refresh();
        }}
      />
      <Modal
        open={showErrorModal}
        variant="error"
        title="Could not update status"
        description="The status entry could not be updated. Please try again."
        onClose={() => setShowErrorModal(false)}
      />
    </>
  );
}
