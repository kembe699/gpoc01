export function Card({ className = "", ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-[6px] border border-[var(--color-border)] bg-[var(--color-card)] p-6 ${className}`}
      {...rest}
    />
  );
}
