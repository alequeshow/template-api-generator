"use client";

import { useId } from "react";

type ToggleProps = {
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  hint?: string;
};

export function Toggle({ label, checked, defaultChecked, onChange, disabled, hint }: ToggleProps) {
  const id = useId();
  const thumbId = `${id}-thumb`;

  return (
    <div className="sa-field" style={{ gap: "0.2rem" }}>
      <label htmlFor={id} className="sa-toggle-wrapper">
        <span className="sa-toggle">
          <input
            type="checkbox"
            id={id}
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            aria-describedby={hint ? `${id}-hint` : undefined}
            onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
          />
          <span className="sa-toggle-track" aria-hidden="true" />
          <span id={thumbId} className="sa-toggle-thumb" aria-hidden="true" />
        </span>
        {label}
      </label>
      {hint ? (
        <small id={`${id}-hint`} className="sa-field-hint" style={{ paddingLeft: "2.75rem" }}>
          {hint}
        </small>
      ) : null}
    </div>
  );
}
