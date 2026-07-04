"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  footer?: ReactNode;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
};

export function Modal({ open, onClose, title, footer, children, size = "md" }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const maxWidth = size === "sm" ? "360px" : size === "lg" ? "720px" : "540px";

  return (
    <div
      className="sa-modal-overlay"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "sa-modal-title" : undefined}
        className="sa-modal"
        style={{ maxWidth }}
      >
        {title ? (
          <div className="sa-modal-header">
            <h2 id="sa-modal-title" className="sa-modal-title">
              {title}
            </h2>
            <button type="button" className="sa-modal-close" onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="sa-modal-close"
            onClick={onClose}
            aria-label="Close"
            style={{ position: "absolute", top: "0.75rem", right: "0.75rem" }}
          >
            ✕
          </button>
        )}
        <div className="sa-modal-body">{children}</div>
        {footer ? <div className="sa-modal-footer">{footer}</div> : null}
      </div>
    </div>
  );
}
