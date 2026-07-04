type RadioOption = {
  value: string;
  label: string;
};

type RadioGroupProps = {
  label?: string;
  name: string;
  options: RadioOption[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
};

export function RadioGroup({ label, name, options, defaultValue, value, onChange, disabled }: RadioGroupProps) {
  return (
    <div className="sa-field">
      {label ? <span className="sa-field-label">{label}</span> : null}
      <div className="sa-radio-group">
        {options.map((opt) => (
          <label key={opt.value} className="sa-radio-label">
            <input
              type="radio"
              name={name}
              value={opt.value}
              defaultChecked={defaultValue === opt.value}
              checked={value !== undefined ? value === opt.value : undefined}
              onChange={onChange ? () => onChange(opt.value) : undefined}
              disabled={disabled}
              className="sa-radio"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}
