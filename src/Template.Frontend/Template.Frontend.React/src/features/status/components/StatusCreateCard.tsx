"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { STATUS_MODAL_TIMEOUT_MS } from "@/features/status/constants";
import { StatusForm } from "@/features/status/components/StatusForm";
import { useCreateStatusMutation } from "@/features/status/hooks/useStatus";
import { Modal } from "@/shared/ui/Modal";

export function StatusCreateCard() {
  const router = useRouter();
  const createMutation = useCreateStatusMutation();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  return (
    <>
      <StatusForm
        submitLabel="Create"
        onSubmit={(payload) => createMutation.mutateAsync(payload)}
        onSuccess={() => setShowSuccessModal(true)}
        onError={() => setShowErrorModal(true)}
      />
      <Modal
        open={showSuccessModal}
        variant="success"
        title="Status created"
        description="The status entry was created successfully."
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
        title="Could not create status"
        description="The status entry could not be created. Please try again."
        onClose={() => setShowErrorModal(false)}
      />
    </>
  );
}
