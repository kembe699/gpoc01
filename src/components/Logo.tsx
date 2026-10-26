import Image from "next/image";

// The GPOC logo from /public (logo.svg or logo.png, found at build time in
// next.config.ts — on Vercel, public/ isn't on the function's disk). Falls
// back to a plain text wordmark if neither file exists. The logo artwork
// includes the "GPOC" lettering, so no text wordmark is shown beside it.
const logoSrc = process.env.NEXT_PUBLIC_LOGO || "";

export function Logo({
  className = "",
  variant = "dark",
}: {
  className?: string;
  // "light" is for use on the dark brand panels (auth screens), where the
  // logo's dark lettering needs a white badge behind it.
  variant?: "dark" | "light";
}) {
  const isLight = variant === "light";
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {logoSrc ? (
        <span className={isLight ? "rounded-[6px] bg-white px-2 py-1" : ""}>
          {/* 200 × 150 artwork, shown 40px tall */}
          <Image src={logoSrc} alt="GPOC" width={53} height={40} priority className="h-10 w-auto" />
        </span>
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
        HSE
      </span>
    </div>
  );
}
