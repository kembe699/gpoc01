type NoticeProps = {
  tone: "warning" | "success" | "info";
  children: React.ReactNode;
  className?: string;
};

const STYLES: Record<NoticeProps["tone"], string> = {
  warning: "border-[var(--color-danger)] bg-[var(--color-danger-bg)] text-[var(--color-danger)]",
  success: "border-[var(--color-success)] bg-[var(--color-success-bg)] text-[var(--color-success)]",
  info: "border-[var(--color-border)] bg-[var(--color-page-bg)] text-[var(--color-navy)]",
};

export function Notice({ tone, children, className = "" }: NoticeProps) {
  return (
    <div
      role={tone === "warning" ? "alert" : "status"}
      className={`rounded-[6px] border px-4 py-3 text-sm ${STYLES[tone]} ${className}`}
    >
      {children}
    </div>
  );
}
