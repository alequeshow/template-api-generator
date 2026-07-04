import type { SelectHTMLAttributes } from "react";

type SelectOption = {
  value: string;
  label: string;
};

type SelectFieldProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  label: string;
  id: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  hint?: string;
  required?: boolean;
};

export function SelectField({
  label,
  id,
  options,
  placeholder,
  error,
  hint,
  required,
  ...selectProps
}: SelectFieldProps) {
  return (
    <div className="sa-field">
      <label htmlFor={id} className="sa-field-label">
        {label}
        {required ? <span aria-hidden="true" style={{ color: "var(--sa-danger)", marginLeft: "0.2rem" }}>*</span> : null}
      </label>
      <select
        id={id}
        className="sa-select"
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        aria-invalid={error ? true : undefined}
        {...selectProps}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
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
