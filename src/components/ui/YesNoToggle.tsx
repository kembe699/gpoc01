type YesNoToggleProps = {
  label: string;
  value: boolean | undefined;
  onChange: (value: boolean) => void;
  error?: string;
};

// Large, tap-friendly Yes/No buttons rather than native radios — easier to
// hit accurately on a phone. "Yes" is styled in the warning colour here
// because for every one of these questions, Yes is the answer that matters
// clinically (a potential exposure), which is exactly what the warning
// colour is for.
export function YesNoToggle({ label, value, onChange, error }: YesNoToggleProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm text-[var(--color-navy)]">{label}</legend>
      <div className="flex gap-3" role="radiogroup" aria-label={label}>
        <button
          type="button"
          role="radio"
          aria-checked={value === false}
          onClick={() => onChange(false)}
          className={`flex-1 rounded-[6px] border px-4 py-3 text-sm font-semibold transition-colors ${
            value === false
              ? "border-[var(--color-teal)] bg-[var(--color-teal)] text-white"
              : "border-[var(--color-border)] bg-white text-[var(--color-navy)] hover:border-[var(--color-teal)]"
          }`}
        >
          No
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={value === true}
          onClick={() => onChange(true)}
          className={`flex-1 rounded-[6px] border px-4 py-3 text-sm font-semibold transition-colors ${
            value === true
              ? "border-[var(--color-danger)] bg-[var(--color-danger)] text-white"
              : "border-[var(--color-border)] bg-white text-[var(--color-navy)] hover:border-[var(--color-danger)]"
          }`}
        >
          Yes
        </button>
      </div>
      {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
    </fieldset>
  );
}
