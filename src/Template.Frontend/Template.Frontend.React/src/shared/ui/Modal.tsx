"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type ModalVariant = "success" | "error" | "confirmation" | "info";
export type ModalCloseReason = "confirm" | "cancel" | "dismiss" | "timeout";

export type ModalClosePolicy = {
  allowBackdropDismiss?: boolean;
  allowEscapeDismiss?: boolean;
  showCloseButton?: boolean;
};

type ModalProps = {
  open: boolean;
  variant: ModalVariant;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  timeoutMs?: number;
  showProgress?: boolean;
  closePolicy?: ModalClosePolicy;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  onDismiss?: () => void;
  onClose?: (reason: ModalCloseReason) => void;
  onOpen?: () => void;
};

const focusableSelector =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function ModalIcon({ variant }: { variant: ModalVariant }) {
  if (variant === "success") {
    return (
      <div className="sa-alert-modal-icon sa-alert-modal-icon-success" aria-hidden="true">
        <span className="sa-alert-modal-success-placeholder" />
        <span className="sa-alert-modal-success-fix" />
        <span className="sa-alert-modal-success-line sa-alert-modal-success-tip" />
        <span className="sa-alert-modal-success-line sa-alert-modal-success-long" />
      </div>
    );
  }

  if (variant === "error") {
    return (
      <div className="sa-alert-modal-icon sa-alert-modal-icon-error" aria-hidden="true">
        <span className="sa-alert-modal-error-line sa-alert-modal-error-left" />
        <span className="sa-alert-modal-error-line sa-alert-modal-error-right" />
      </div>
    );
  }

  if (variant === "confirmation") {
    return (
      <div className="sa-alert-modal-icon sa-alert-modal-icon-warning" aria-hidden="true">
        <span className="sa-alert-modal-warning-body" />
        <span className="sa-alert-modal-warning-dot" />
      </div>
    );
  }

  return <div className="sa-alert-modal-icon sa-alert-modal-icon-info" aria-hidden="true" />;
}

export function Modal({
  open,
  variant,
  title,
  description,
  children,
  confirmLabel = variant === "confirmation" ? "Confirm" : "OK",
  cancelLabel = "Cancel",
  timeoutMs,
  showProgress = false,
  closePolicy,
  onConfirm,
  onCancel,
  onDismiss,
  onClose,
  onOpen,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [remainingMs, setRemainingMs] = useState(timeoutMs ?? 0);
  const titleId = useId();
  const descriptionId = useId();

  const allowEscapeDismiss = closePolicy?.allowEscapeDismiss ?? true;
  const allowBackdropDismiss = closePolicy?.allowBackdropDismiss ?? true;
  const showCloseButton = closePolicy?.showCloseButton ?? false;

  const close = useCallback(
    (reason: ModalCloseReason) => {
      if (isPending) return;

      if (reason === "cancel") onCancel?.();
      if (reason === "dismiss" || reason === "timeout") onDismiss?.();
      onClose?.(reason);
    },
    [isPending, onCancel, onClose, onDismiss],
  );

  useEffect(() => {
    if (!open) return;

    triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    onOpen?.();

    const animationFrame = window.requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLElement>("[data-modal-autofocus]")?.focus();
    });

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && allowEscapeDismiss) {
        e.preventDefault();
        close("dismiss");
        return;
      }

      if (e.key !== "Tab") return;

      const focusableElements = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
      );
      if (focusableElements.length === 0) {
        e.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.cancelAnimationFrame(animationFrame);
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [allowEscapeDismiss, close, onOpen, open]);

  useEffect(() => {
    if (!open || !timeoutMs || isPending) return;

    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      const remaining = Math.max(0, timeoutMs - (Date.now() - startedAt));
      setRemainingMs(remaining);
      if (remaining === 0) {
        window.clearInterval(interval);
        close("timeout");
      }
    }, 50);

    return () => window.clearInterval(interval);
  }, [close, isPending, open, timeoutMs]);

  const handleConfirm = async () => {
    if (isPending) return;

    if (!onConfirm) {
      close("confirm");
      return;
    }

    setIsPending(true);
    try {
      await onConfirm();
      onClose?.("confirm");
    } finally {
      setIsPending(false);
    }
  };

  if (!open) return null;

  const isConfirmation = variant === "confirmation";
  const progressValue = timeoutMs ? (remainingMs / timeoutMs) * 100 : 0;

  return (
    <div
      className="sa-alert-modal-overlay"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget && allowBackdropDismiss) close("dismiss");
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        aria-busy={isPending || undefined}
        className="sa-alert-modal"
        data-variant={variant}
        tabIndex={-1}
      >
        {showCloseButton ? (
          <button
            type="button"
            className="sa-alert-modal-close"
            onClick={() => close("dismiss")}
            disabled={isPending}
            aria-label="Close"
          >
            ✕
          </button>
        ) : null}
        <ModalIcon variant={variant} />
        <h2 id={titleId} className="sa-alert-modal-title">
          {title}
        </h2>
        {description ? (
          <div id={descriptionId} className="sa-alert-modal-description">
            {description}
          </div>
        ) : null}
        {children ? <div className="sa-alert-modal-content">{children}</div> : null}
        <div className="sa-alert-modal-actions">
          {isConfirmation ? (
            <button
              type="button"
              className="sa-alert-modal-button sa-alert-modal-button-cancel"
              onClick={() => close("cancel")}
              disabled={isPending}
            >
              {cancelLabel}
            </button>
          ) : null}
          <button
            type="button"
            className="sa-alert-modal-button"
            data-variant={variant}
            onClick={handleConfirm}
            disabled={isPending}
            data-modal-autofocus
          >
            {isPending ? "Working..." : confirmLabel}
          </button>
        </div>
        {timeoutMs && showProgress ? (
          <progress
            className="sa-alert-modal-progress"
            value={progressValue}
            max="100"
            aria-label="Time remaining before this modal closes"
          />
        ) : null}
      </div>
    </div>
  );
}
