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
  Plane,
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

export default async function LandingPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col">
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
        {/* Hero */}
        <section className="relative overflow-hidden bg-[var(--color-navy)]">
          <div className="pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden="true">
            <svg width="100%" height="100%">
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8fb9b2]">
                GPOC Health &amp; Safety
              </p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Ebola Virus Disease Travel Screening
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#c3d1cd]">
                All GPOC staff travelling abroad must complete this screening before travel. It
                takes a few minutes, flags anything that needs clinic follow-up, and gives you a
                QR-coded pass you can show at the clinic or a checkpoint.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
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

            {/* Icon composition — deliberately not a photograph: a clinical photo
                of illness would be distressing and out of place for a staff
                safety tool, so this uses the same iconography as the rest of
                the app instead. */}
            <div className="relative hidden h-80 items-center justify-center lg:flex" aria-hidden="true">
              <div className="absolute h-64 w-64 rounded-full border border-white/10" />
              <div className="absolute h-44 w-44 rounded-full border border-white/10" />
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[var(--color-teal)] shadow-[0_0_60px_-10px_rgba(13,107,95,0.8)]">
                <ShieldCheck size={48} className="text-white" strokeWidth={1.5} />
              </div>
              <div className="absolute -top-2 right-10 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                <Plane size={24} className="text-white" strokeWidth={1.5} />
              </div>
              <div className="absolute bottom-2 left-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                <Thermometer size={24} className="text-white" strokeWidth={1.5} />
              </div>
              <div className="absolute bottom-16 right-0 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                <Droplets size={18} className="text-white" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </section>

        {/* Quick facts — floats over the hero/body seam */}
        <section className="relative z-10 mx-auto -mt-10 max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-4 rounded-[6px] border border-[var(--color-border)] bg-white p-4 shadow-sm sm:grid-cols-4 sm:p-6">
            {quickFacts.map((fact) => {
              const Icon = ICONS[fact.icon] ?? Info;
              return (
                <div key={fact.label} className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-success-bg)] text-[var(--color-teal)]">
                    <Icon size={18} strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-navy)]">{fact.value}</p>
                    <p className="text-xs text-[var(--color-muted)]">{fact.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Awareness */}
        <section id="awareness" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-[var(--color-navy)] sm:text-3xl">
              Ebola awareness
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
              What it is, how it spreads, and what to do — the essentials every GPOC traveller
              should know before departure.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {awarenessSections.map((section) => {
              const Icon = ICONS[section.icon] ?? Info;
              return (
                <div
                  key={section.title}
                  className="group rounded-[6px] border border-[var(--color-border)] bg-white p-6 transition-shadow hover:shadow-md"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[var(--color-success-bg)] text-[var(--color-teal)] transition-colors group-hover:bg-[var(--color-teal)] group-hover:text-white">
                    <Icon size={20} strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-[var(--color-teal)]">
                    {section.title}
                  </h3>
                  {section.intro && (
                    <p className="mt-2 text-sm font-medium text-[var(--color-navy)]">{section.intro}</p>
                  )}
                  <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-[var(--color-navy)]">
                    {section.items.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-teal)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Resources */}
        <section className="border-t border-[var(--color-border)] bg-[var(--color-card)]">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              Learn more from global health authorities
            </h2>
            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
              {resourceLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-teal)] hover:underline"
                >
                  {link.name}
                  <ExternalLink size={13} aria-hidden="true" />
                </a>
              ))}
            </div>
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
