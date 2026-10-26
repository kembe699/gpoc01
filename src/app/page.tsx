import Link from "next/link";
import { ArrowRight, LogIn } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { config } from "@/lib/config";

export default async function LandingPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
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

      <main className="flex flex-1 items-center bg-[var(--color-navy)]">
        <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8fb9b2]">
            HSE Department &middot; President&rsquo;s Office (PO)
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl lg:text-5xl">
            GPOC Staff Travel Screening
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#c3d1cd]">
            For GPOC staff travelling out of the country and coming back. Complete the screening
            form before you travel and on your return. This system is run by the Health, Safety
            and Environment (HSE) Department under the President&rsquo;s Office.
          </p>

          <div className="mt-8 max-w-2xl rounded-[6px] border border-white/10 bg-white/5 p-5">
            {user ? (
              <>
                <p className="text-sm font-medium text-white">You are signed in.</p>
                <Link
                  href="/screenings/new"
                  className="mt-4 inline-flex items-center gap-2 rounded-[6px] bg-[var(--color-teal)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--color-teal-dark)]"
                >
                  Fill in the screening form
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-white">
                  You must sign in before you can fill in the screening form.
                </p>
                <p className="mt-1 text-sm text-[#c3d1cd]">
                  First time here? Create an account with your GPOC details, then sign in.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-[6px] bg-[var(--color-teal)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--color-teal-dark)]"
                  >
                    <LogIn size={16} aria-hidden="true" />
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-[6px] border border-white/25 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    Create account
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--color-border)] bg-[var(--color-card)] py-6">
        <div className="mx-auto max-w-5xl px-4 text-center text-sm text-[var(--color-muted)] sm:px-6">
          <p>&copy; {new Date().getFullYear()} GPOC &middot; HSE Department, President&rsquo;s Office.</p>
          <p className="mt-1">
            Clinic: {config.clinic.phone} &middot; {config.clinic.email}
          </p>
        </div>
      </footer>
    </div>
  );
}
