import Link from "next/link";
import {
  Info,
  Share2,
  Thermometer,
  ShieldCheck,
  PhoneCall,
  Clock,
  Droplets,
  Wind,
  Globe2,
  ArrowRight,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { awarenessSections, quickFacts, resourceLinks } from "@/content/awareness";
import { config } from "@/lib/config";

const ICONS: Record<string, LucideIcon> = {
  Info,
  Share2,
  Thermometer,
  ShieldCheck,
  PhoneCall,
  Clock,
  Droplets,
  Wind,
  Globe2,
};

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default async function LandingPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-[var(--color-navy)] py-1.5 text-center text-[11px] font-medium uppercase tracking-[0.12em] text-[#9fc2bb] sm:text-xs">
        GPOC internal &middot; Health &amp; Safety advisory &middot; In effect
      </div>

      <header className="border-b border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-1.5 sm:gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="rounded-[6px] bg-[var(--color-teal)] px-3 py-2 text-xs font-medium text-white hover:bg-[var(--color-teal-dark)] sm:px-4 sm:text-sm"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-[6px] px-2 py-2 text-xs font-medium text-[var(--color-navy)] hover:bg-[var(--color-page-bg)] sm:px-3 sm:text-sm"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="rounded-[6px] bg-[var(--color-teal)] px-3 py-2 text-xs font-medium text-white hover:bg-[var(--color-teal-dark)] sm:px-4 sm:text-sm"
                >
                  <span className="sm:hidden">Sign up</span>
                  <span className="hidden sm:inline">Create account</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero — a light band is left for the "At a glance" panel below the
            fold rule; the dark masthead carries the headline, same as a
            printed advisory's letterhead, not a product screenshot. */}
        <section className="relative overflow-hidden bg-[var(--color-navy)]">
          <div className="pointer-events-none absolute inset-0 opacity-[0.05]" aria-hidden="true">
            <svg width="100%" height="100%">
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-18 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:py-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8fb9b2]">
                Travel health requirement
              </p>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Ebola Virus Disease Travel Screening
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#c3d1cd]">
                All GPOC staff travelling abroad must complete this screening before travel. It
                takes a few minutes, flags anything that needs clinic follow-up, and gives you a
                QR-coded pass you can show at the clinic or a checkpoint.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link
                  href={user ? "/dashboard" : "/login"}
                  className="inline-flex items-center gap-2 rounded-[6px] bg-[var(--color-teal)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--color-teal-dark)]"
                >
                  Start screening
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <a
                  href="#awareness"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#c3d1cd] hover:text-white"
                >
                  Learn about Ebola
                </a>
              </div>
            </div>

            {/* "At a glance" summary — the hero's factual counterpart to the
                paragraph beside it, styled like a requirement notice's fact
                panel rather than illustrative artwork. */}
            <div className="rounded-[6px] border border-white/10 bg-white p-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                At a glance
              </p>
              <dl className="mt-4 flex flex-col gap-3.5 text-sm">
                {[
                  { term: "Status", value: "Required before travel" },
                  { term: "Applies to", value: "All GPOC staff travelling abroad" },
                  { term: "Time required", value: "About 5 minutes" },
                  { term: "Your pass", value: "QR-coded, verifiable on scan" },
                  { term: "Issued by", value: "GPOC Health & Safety" },
                ].map((row, i, arr) => (
                  <div
                    key={row.term}
                    className={`flex items-start justify-between gap-4 ${i < arr.length - 1 ? "border-b border-[var(--color-border)] pb-3.5" : ""}`}
                  >
                    <dt className="text-[var(--color-muted)]">{row.term}</dt>
                    <dd className="text-right font-medium text-[var(--color-navy)]">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* Quick facts — a reference strip, not illustration */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-page-bg)]">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 sm:divide-x sm:divide-[var(--color-border)]">
              {quickFacts.map((fact) => {
                const Icon = ICONS[fact.icon] ?? Info;
                return (
                  <div key={fact.label} className="flex items-start gap-2.5 sm:pl-6 sm:first:pl-0">
                    <Icon size={16} className="mt-0.5 shrink-0 text-[var(--color-teal)]" strokeWidth={1.75} aria-hidden="true" />
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-navy)]">{fact.value}</p>
                      <p className="text-xs text-[var(--color-muted)]">{fact.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Awareness — read as a short reference document: a jump nav, then
            numbered, dividing sections rather than a grid of marketing cards. */}
        <section id="awareness" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-teal)]">
              Ebola awareness
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[var(--color-navy)] sm:text-3xl">
              What every traveller should know
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
              What it is, how it spreads, and what to do — the essentials every GPOC traveller
              should know before departure.
            </p>
          </div>

          <nav aria-label="Jump to section" className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-y border-[var(--color-border)] py-3">
            {awarenessSections.map((section) => (
              <a
                key={section.title}
                href={`#${slugify(section.title)}`}
                className="text-sm font-medium text-[var(--color-navy)] hover:text-[var(--color-teal)]"
              >
                {section.title}
              </a>
            ))}
          </nav>

          <div className="mt-4 flex flex-col divide-y divide-[var(--color-border)]">
            {awarenessSections.map((section) => {
              const Icon = ICONS[section.icon] ?? Info;
              const isWarning = section.title === "If you feel unwell";
              return (
                <div
                  key={section.title}
                  id={slugify(section.title)}
                  className={`scroll-mt-20 grid gap-4 py-10 sm:grid-cols-[200px_1fr] sm:gap-8 ${
                    isWarning ? "border-l-4 border-[var(--color-danger)] bg-[var(--color-danger-bg)] px-5 py-8 sm:px-8" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] border ${
                        isWarning
                          ? "border-[var(--color-danger)] text-[var(--color-danger)]"
                          : "border-[var(--color-border)] text-[var(--color-teal)]"
                      }`}
                    >
                      <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <h3
                      className={`text-base font-semibold ${
                        isWarning ? "text-[var(--color-danger)]" : "text-[var(--color-navy)]"
                      }`}
                    >
                      {section.title}
                    </h3>
                  </div>
                  <div>
                    {section.intro && (
                      <p className="text-sm font-medium text-[var(--color-navy)]">{section.intro}</p>
                    )}
                    <ul className={`flex flex-col gap-2.5 text-sm leading-relaxed text-[var(--color-navy)] ${section.intro ? "mt-3" : ""}`}>
                      {section.items.map((item) => (
                        <li key={item} className="flex gap-2.5">
                          <span
                            aria-hidden="true"
                            className={`mt-2 h-1 w-1 shrink-0 rounded-full ${
                              isWarning ? "bg-[var(--color-danger)]" : "bg-[var(--color-teal)]"
                            }`}
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Resources — cited like references, not a link farm */}
        <section className="border-t border-[var(--color-border)] bg-[var(--color-card)]">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              References
            </h2>
            <ol className="mt-5 flex flex-col gap-3 border-t border-[var(--color-border)] pt-5">
              {resourceLinks.map((link, i) => (
                <li key={link.url} className="flex items-start gap-3 text-sm">
                  <span className="font-mono text-xs text-[var(--color-muted)]">[{i + 1}]</span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium text-[var(--color-teal)] hover:underline"
                  >
                    {link.name}
                    <ExternalLink size={13} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--color-border)] bg-[var(--color-card)] py-6">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-[var(--color-muted)] sm:px-6">
          <p>&copy; {new Date().getFullYear()} GPOC. Health &amp; Safety Department.</p>
          <p className="mt-1">
            Clinic: {config.clinic.phone} &middot; {config.clinic.email}
          </p>
        </div>
      </footer>
    </div>
  );
}
