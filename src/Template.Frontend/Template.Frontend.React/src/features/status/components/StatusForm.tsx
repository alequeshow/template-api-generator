"use client";

import { useMemo, useState } from "react";

import { AlertMessage } from "@/shared/ui/AlertMessage";
import type { StatusItem } from "@/features/status/types";

type StatusFormProps = {
  title: string;
  submitLabel: string;
  initialValue?: StatusItem;
  readOnly?: boolean;
  onSubmit: (value: StatusItem) => Promise<void>;
};

function toDateTimeLocalValue(value?: string) {
  if (!value) {
    return new Date().toISOString().slice(0, 16);
  }

  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
  return adjustedDate.toISOString().slice(0, 16);
}

export function StatusForm({ title, submitLabel, initialValue, readOnly = false, onSubmit }: StatusFormProps) {
  const [message, setMessage] = useState<string>();
  const [messageType, setMessageType] = useState<"success" | "warning" | "error">("warning");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValue = useMemo(
    () => ({
      id: initialValue?.id,
      value: initialValue?.value ?? "",
      description: initialValue?.description ?? "",
      timeStamp: toDateTimeLocalValue(initialValue?.timeStamp),
    }),
    [initialValue],
  );

  return (
    <form
      className="sa-form"
      onSubmit={async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const value = String(formData.get("value") ?? "").trim();

        if (!value) {
          setMessage("Value is required");
          setMessageType("warning");
          return;
        }

        setIsSubmitting(true);

        const payload: StatusItem = {
          id: String(formData.get("id") ?? "") || undefined,
          value,
          description: String(formData.get("description") ?? "") || undefined,
          timeStamp: new Date(String(formData.get("timeStamp") ?? new Date().toISOString())).toISOString(),
        };

        try {
          await onSubmit(payload);
          setMessageType("success");
          setMessage(`${title} completed successfully.`);
        } catch {
          setMessageType("error");
          setMessage(`Could not complete ${title.toLowerCase()}.`);
        } finally {
          setIsSubmitting(false);
        }
      }}
    >
      <AlertMessage message={message} type={messageType} />

      <input type="hidden" name="id" defaultValue={defaultValue.id ?? ""} />

      <div className="sa-field">
        <label htmlFor="value">Value</label>
        <input id="value" name="value" type="text" defaultValue={defaultValue.value} disabled={readOnly} />
      </div>

      <div className="sa-field">
        <label htmlFor="description">Description</label>
        <input id="description" name="description" type="text" defaultValue={defaultValue.description} disabled={readOnly} />
      </div>

      <div className="sa-field">
        <label htmlFor="timeStamp">Time stamp</label>
        <input
          id="timeStamp"
          name="timeStamp"
          type="datetime-local"
          defaultValue={defaultValue.timeStamp}
          disabled={readOnly}
        />
      </div>

      <button className="sa-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Working..." : submitLabel}
      </button>
    </form>
  );
}
