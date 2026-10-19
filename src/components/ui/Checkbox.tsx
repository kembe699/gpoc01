import { forwardRef } from "react";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: React.ReactNode;
  error?: string;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, error, id, className = "", ...rest },
  ref
) {
  const inputId = id ?? rest.name;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="flex items-start gap-3 text-sm text-[var(--color-navy)]">
        <input
          id={inputId}
          ref={ref}
          type="checkbox"
          className={`mt-0.5 h-4 w-4 shrink-0 rounded-[4px] border-[var(--color-border)] text-[var(--color-teal)] focus:ring-[var(--color-teal)] ${className}`}
          {...rest}
        />
        <span>{label}</span>
      </label>
      {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
    </div>
  );
});
