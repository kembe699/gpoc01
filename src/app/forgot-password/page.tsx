import Link from "next/link";
import type { Metadata } from "next";
import { AuthLayout } from "@/components/AuthLayout";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";

export const metadata: Metadata = { title: "Forgot password | GPOC EVD Travel Screening" };

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
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
    </AuthLayout>
  );
}
