import Link from "next/link";
import type { Metadata } from "next";
import { AuthLayout } from "@/components/AuthLayout";
import { Notice } from "@/components/ui/Notice";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = { title: "Sign in | GPOC EVD Travel Screening" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; reset?: string }>;
}) {
  const params = await searchParams;

  return (
    <AuthLayout>
      <h1 className="text-xl font-semibold text-[var(--color-navy)]">Sign in</h1>
      {params.reset === "success" && (
        <Notice tone="success" className="mt-4">
          Your password has been reset. Please sign in.
        </Notice>
      )}
      <div className="mt-6">
        <LoginForm next={params.next} />
      </div>
      <div className="mt-6 flex flex-col gap-2 text-sm text-[var(--color-muted)]">
        <Link href="/forgot-password" className="text-[var(--color-teal)] hover:underline">
          Forgot your password?
        </Link>
        <p>
          New here?{" "}
          <Link href="/register" className="text-[var(--color-teal)] hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
