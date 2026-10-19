"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, LogOut } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/screenings/new", label: "New screening" },
  { href: "/history", label: "History" },
];

// `logo` is rendered server-side and passed in rather than importing
// <Logo /> directly here — Logo checks the filesystem for a real logo.svg
// (Node's `fs`), which can't be bundled into this Client Component's
// browser code. Passing the already-rendered server output as a prop
// keeps that check on the server while this component stays interactive.
export function AppNav({ fullName, logo }: { fullName: string; logo: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const firstName = fullName.split(" ")[0] || fullName;

  return (
    <header className="no-print sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-card)]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/dashboard" aria-label="GPOC Health & Safety home">
          {logo}
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-[var(--color-teal)]"
                  : "text-[var(--color-navy)] hover:text-[var(--color-teal)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              className="flex items-center gap-2 rounded-[6px] px-2 py-1.5 text-sm font-medium text-[var(--color-navy)] hover:bg-[var(--color-page-bg)]"
            >
              <User size={16} aria-hidden="true" />
              {firstName}
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-[6px] border border-[var(--color-border)] bg-white py-1 shadow-sm">
                <Link
                  href="/account"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-sm text-[var(--color-navy)] hover:bg-[var(--color-page-bg)]"
                >
                  Account
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-[var(--color-navy)] hover:bg-[var(--color-page-bg)]"
                  >
                    <LogOut size={14} aria-hidden="true" />
                    Sign out
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          className="md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="border-t border-[var(--color-border)] px-4 py-3 md:hidden" aria-label="Main">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-[6px] px-3 py-2.5 text-sm font-medium ${
                    pathname === link.href
                      ? "bg-[var(--color-page-bg)] text-[var(--color-teal)]"
                      : "text-[var(--color-navy)]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="block rounded-[6px] px-3 py-2.5 text-sm font-medium text-[var(--color-navy)]"
              >
                Account
              </Link>
            </li>
            <li>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="block w-full rounded-[6px] px-3 py-2.5 text-left text-sm font-medium text-[var(--color-navy)]"
                >
                  Sign out
                </button>
              </form>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
