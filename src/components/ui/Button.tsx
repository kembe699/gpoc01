import { forwardRef } from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

const VARIANTS: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-[var(--color-teal)] text-white hover:bg-[var(--color-teal-dark)]",
  secondary:
    "bg-white text-[var(--color-navy)] border border-[var(--color-border)] hover:border-[var(--color-teal)]",
  ghost: "text-[var(--color-navy)] hover:bg-[var(--color-page-bg)]",
  danger: "bg-[var(--color-danger)] text-white hover:opacity-90",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", className = "", ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-[6px] px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...rest}
    />
  );
});
