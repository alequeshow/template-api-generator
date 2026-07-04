import type { InputHTMLAttributes } from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  required?: boolean;
};

export function FormField({ label, id, error, hint, required, className, ...inputProps }: FormFieldProps) {
  return (
    <div className="sa-field">
      <label htmlFor={id} className="sa-field-label">
        {label}
        {required ? <span aria-hidden="true" style={{ color: "var(--sa-danger)", marginLeft: "0.2rem" }}>*</span> : null}
      </label>
      <input
        id={id}
        className={["sa-input", className].filter(Boolean).join(" ")}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        aria-invalid={error ? true : undefined}
        data-invalid={error ? true : undefined}
        {...inputProps}
      />
      {error ? (
        <small id={`${id}-error`} className="sa-field-error" role="alert">
          {error}
        </small>
      ) : hint ? (
        <small id={`${id}-hint`} className="sa-field-hint">
          {hint}
        </small>
      ) : null}
    </div>
  );
}

type TextareaFieldProps = {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  required?: boolean;
  rows?: number;
  disabled?: boolean;
  defaultValue?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
};

export function TextareaField({
  label,
  id,
  error,
  hint,
  required,
  ...textareaProps
}: TextareaFieldProps) {
  return (
    <div className="sa-field">
      <label htmlFor={id} className="sa-field-label">
        {label}
        {required ? <span aria-hidden="true" style={{ color: "var(--sa-danger)", marginLeft: "0.2rem" }}>*</span> : null}
      </label>
      <textarea
        id={id}
        className="sa-textarea"
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        aria-invalid={error ? true : undefined}
        {...textareaProps}
      />
      {error ? (
        <small id={`${id}-error`} className="sa-field-error" role="alert">
          {error}
        </small>
      ) : hint ? (
        <small id={`${id}-hint`} className="sa-field-hint">
          {hint}
        </small>
      ) : null}
    </div>
  );
}
