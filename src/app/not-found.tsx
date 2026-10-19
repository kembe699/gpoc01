import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo />
      <div>
        <h1 className="text-xl font-semibold text-[var(--color-navy)]">Page not found</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          The page you&apos;re looking for doesn&apos;t exist, or you don&apos;t have access to it.
        </p>
      </div>
      <Link href="/dashboard" className="text-sm font-medium text-[var(--color-teal)] hover:underline">
        Go to dashboard
      </Link>
    </div>
  );
}
