import { Logo } from "./Logo";

const FACTS = [
  { term: "Who", value: "All GPOC staff travelling abroad" },
  { term: "Time", value: "About 5 minutes" },
  { term: "Your pass", value: "QR-coded, verifiable on scan" },
];

// Shared by all four auth screens (login, register, forgot/reset password)
// instead of each one centering its own card in empty grey space — the
// brand panel carries the same navy/"at a glance" language as the landing
// page, so signing in reads as part of the same product, not a stock
// auth-template screen.
export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="relative overflow-hidden bg-[var(--color-navy)] lg:w-[42%]">
        {/* The logo's swirl colours, as a thin stripe */}
        <div className="absolute inset-x-0 top-0 h-1" style={{ background: "var(--gradient-brand)" }} aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]" aria-hidden="true">
          <svg width="100%" height="100%">
            <pattern id="auth-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#auth-grid)" />
          </svg>
        </div>

        <div className="relative flex flex-col px-6 py-8 sm:px-10 lg:h-full lg:justify-between lg:px-12 lg:py-14">
          <Logo variant="light" />

          <div className="mt-6 lg:mt-16">
            <p className="max-w-sm text-xl font-bold leading-snug text-white lg:text-2xl">
              Screen before you travel.
            </p>
            <p className="mt-3 hidden max-w-sm text-sm leading-relaxed text-[#c9d6e8] lg:block">
              Every GPOC staff member travelling abroad completes a short EVD exposure check and
              leaves with a verifiable travel pass.
            </p>
          </div>

          <dl className="mt-10 hidden flex-col gap-3.5 lg:flex">
            {FACTS.map((fact, i) => (
              <div
                key={fact.term}
                className={`flex items-start justify-between gap-4 text-sm ${
                  i < FACTS.length - 1 ? "border-b border-white/10 pb-3.5" : ""
                }`}
              >
                <dt className="text-[#a9bcd8]">{fact.term}</dt>
                <dd className="text-right font-medium text-white">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-white px-4 py-10 sm:px-6">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
