import { forwardRef } from "react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, hint, id, className = "", children, ...rest },
  ref
) {
  const inputId = id ?? rest.name;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-navy)]">
        {label}
      </label>
      <select
        id={inputId}
        ref={ref}
        aria-invalid={Boolean(error)}
        className={`rounded-[6px] border bg-white px-3 py-2.5 text-sm text-[var(--color-navy)] focus:border-[var(--color-teal)] ${
          error ? "border-[var(--color-danger)]" : "border-[var(--color-border)]"
        } ${className}`}
        {...rest}
      >
        {children}
      </select>
      {hint && !error && <p className="text-xs text-[var(--color-muted)]">{hint}</p>}
      {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
    </div>
  );
});
