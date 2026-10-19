import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { Card } from "@/components/ui/Card";
import { awarenessSections } from "@/content/awareness";
import { config } from "@/lib/config";

export default async function LandingPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="rounded-[6px] bg-[var(--color-teal)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-teal-dark)]"
              >
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-[6px] px-3 py-2 text-sm font-medium text-[var(--color-navy)] hover:bg-[var(--color-page-bg)]"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="rounded-[6px] bg-[var(--color-teal)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-teal-dark)]"
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-navy)] sm:text-4xl">
            Ebola Virus Disease Travel Screening
          </h1>
          <p className="mx-auto mt-4 max-w-[36rem] text-base leading-relaxed text-[var(--color-muted)]">
            All GPOC staff travelling abroad must complete this screening before travel. It takes a
            few minutes and gives you a pass you can show at the clinic or a checkpoint.
          </p>
          <div className="mt-8">
            <Link
              href={user ? "/dashboard" : "/login"}
              className="inline-flex items-center justify-center rounded-[6px] bg-[var(--color-teal)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--color-teal-dark)]"
            >
              Start screening
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
          <h2 className="text-center text-xl font-semibold text-[var(--color-navy)]">
            Ebola awareness
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {awarenessSections.map((section) => (
              <Card key={section.title}>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-teal)]">
                  {section.title}
                </h3>
                {section.intro && (
                  <p className="mt-2 text-sm text-[var(--color-muted)]">{section.intro}</p>
                )}
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[var(--color-navy)]">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden="true" className="text-[var(--color-teal)]">
                        &bull;
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
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
