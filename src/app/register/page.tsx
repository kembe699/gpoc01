import Link from "next/link";
import type { Metadata } from "next";
import { AuthLayout } from "@/components/AuthLayout";
import { RegisterForm } from "@/components/RegisterForm";

export const metadata: Metadata = { title: "Create account | GPOC EVD Travel Screening" };

export default function RegisterPage() {
  return (
    <AuthLayout>
      <h1 className="text-xl font-semibold text-[var(--color-navy)]">Create your account</h1>
      <div className="mt-6">
        <RegisterForm />
      </div>
      <p className="mt-6 text-sm text-[var(--color-muted)]">
        Already have an account?{" "}
        <Link href="/login" className="text-[var(--color-teal)] hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
