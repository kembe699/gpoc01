import Image from "next/image";

// Swap in the real logo by adding /public/logo.svg — this falls back to a
// plain text wordmark until that file exists, so the app works today and
// just needs the image dropped in later with no code changes. Checked at
// build time (next.config.ts): on Vercel, public/ isn't on the function's disk.
const hasRealLogo = process.env.NEXT_PUBLIC_HAS_LOGO === "1";

export function Logo({
  className = "",
  variant = "dark",
}: {
  className?: string;
  // "light" is for use on the navy/teal brand panels (auth screens, the
  // landing hero) where the default navy wordmark would be invisible.
  variant?: "dark" | "light";
}) {
  const isLight = variant === "light";
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {hasRealLogo ? (
        <Image src="/logo.svg" alt="GPOC" width={96} height={28} priority />
      ) : (
        <span className={`text-xl font-bold tracking-tight ${isLight ? "text-white" : "text-[var(--color-navy)]"}`}>
          GPOC
        </span>
      )}
      <span
        className={`hidden h-6 w-px sm:inline-block ${isLight ? "bg-white/20" : "bg-[var(--color-border)]"}`}
        aria-hidden="true"
      />
      <span className={`hidden text-sm sm:inline ${isLight ? "text-white/70" : "text-[var(--color-muted)]"}`}>
        Health &amp; Safety
      </span>
    </div>
  );
}
