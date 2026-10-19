import Image from "next/image";
import { existsSync } from "fs";
import { join } from "path";

// Swap in the real logo by adding /public/logo.svg — this falls back to a
// plain text wordmark until that file exists, so the app works today and
// just needs the image dropped in later with no code changes.
const hasRealLogo = existsSync(join(process.cwd(), "public", "logo.svg"));

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {hasRealLogo ? (
        <Image src="/logo.svg" alt="GPOC" width={96} height={28} priority />
      ) : (
        <span className="text-xl font-bold tracking-tight text-[var(--color-navy)]">
          GPOC
        </span>
      )}
      <span className="hidden h-6 w-px bg-[var(--color-border)] sm:inline-block" aria-hidden="true" />
      <span className="hidden text-sm text-[var(--color-muted)] sm:inline">Health &amp; Safety</span>
    </div>
  );
}
