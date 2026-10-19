import Link from "next/link";
import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { Card } from "@/components/ui/Card";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";

export const metadata: Metadata = { title: "Forgot password | GPOC EVD Travel Screening" };

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="mb-8">
        <Logo />
      </div>
      <Card className="w-full max-w-sm">
        <h1 className="text-xl font-semibold text-[var(--color-navy)]">Reset your password</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>
        <div className="mt-6">
          <ForgotPasswordForm />
        </div>
        <p className="mt-6 text-sm text-[var(--color-muted)]">
          <Link href="/login" className="text-[var(--color-teal)] hover:underline">
            Back to sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
