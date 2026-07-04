import type { InputHTMLAttributes } from "react";

type CheckboxFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  id: string;
  hint?: string;
};

export function CheckboxField({ label, id, hint, ...inputProps }: CheckboxFieldProps) {
  return (
    <div className="sa-field" style={{ gap: "0.2rem" }}>
      <label htmlFor={id} className="sa-check-label">
        <input
          type="checkbox"
          id={id}
          className="sa-check"
          aria-describedby={hint ? `${id}-hint` : undefined}
          {...inputProps}
        />
        {label}
      </label>
      {hint ? (
        <small id={`${id}-hint`} className="sa-field-hint" style={{ paddingLeft: "1.5rem" }}>
          {hint}
        </small>
      ) : null}
    </div>
  );
}
