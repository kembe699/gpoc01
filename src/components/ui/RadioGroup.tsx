type RadioOption = { value: string; label: string };

type RadioGroupProps = {
  label: string;
  name: string;
  options: RadioOption[];
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string;
};

export function RadioGroup({ label, name, options, value, onChange, error }: RadioGroupProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-medium text-[var(--color-navy)]">{label}</legend>
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`min-w-[120px] flex-1 cursor-pointer rounded-[6px] border px-4 py-2.5 text-center text-sm font-medium transition-colors ${
              value === opt.value
                ? "border-[var(--color-teal)] bg-[var(--color-teal)] text-white"
                : "border-[var(--color-border)] bg-white text-[var(--color-navy)] hover:border-[var(--color-teal)]"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            {opt.label}
          </label>
        ))}
      </div>
      {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
    </fieldset>
  );
}
