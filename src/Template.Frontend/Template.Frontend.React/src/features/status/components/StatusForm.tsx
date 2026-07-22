"use client";

import { useMemo, useState } from "react";

import { AlertMessage } from "@/shared/ui/AlertMessage";
import type { StatusItem } from "@/features/status/types";

type StatusFormProps = {
  submitLabel: string;
  initialValue?: StatusItem;
  readOnly?: boolean;
  onSubmit: (value: StatusItem) => Promise<unknown>;
  onSuccess?: () => void;
  onError?: () => void;
};

function toDateTimeLocalValue(value?: string) {
  const date = value ? new Date(value) : new Date();
  const offset = date.getTimezoneOffset();
  // datetime-local inputs expect local time (without timezone), so we subtract the timezone offset to convert UTC values to local clock time.
  const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
  return adjustedDate.toISOString().slice(0, 16);
}

/**
 * Parses submitted datetime-local field values into an ISO timestamp.
 * Invalid or missing values fall back to the current UTC timestamp.
 */
function parseFormTimestamp(rawValue: FormDataEntryValue | null) {
  const fallback = new Date().toISOString();
  const parsedValue = typeof rawValue === "string" ? rawValue : fallback;
  const parsedDate = new Date(parsedValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return fallback;
  }

  return parsedDate.toISOString();
}

export function StatusForm({ submitLabel, initialValue, readOnly = false, onSubmit, onSuccess, onError }: StatusFormProps) {
  const [validationMessage, setValidationMessage] = useState<string>();
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
          setValidationMessage("Value is required");
          return;
        }

        setValidationMessage(undefined);
        setIsSubmitting(true);

        const payload: StatusItem = {
          id: String(formData.get("id") ?? "") || undefined,
          value,
          description: String(formData.get("description") ?? "") || undefined,
          timeStamp: parseFormTimestamp(formData.get("timeStamp")),
        };

        try {
          await onSubmit(payload);
          onSuccess?.();
        } catch {
          onError?.();
        } finally {
          setIsSubmitting(false);
        }
      }}
    >
      <AlertMessage message={validationMessage} type="warning" />

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
