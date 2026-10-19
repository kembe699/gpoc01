import Link from "next/link";
import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { Card } from "@/components/ui/Card";
import { RegisterForm } from "@/components/RegisterForm";

export const metadata: Metadata = { title: "Create account | GPOC EVD Travel Screening" };

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="mb-8">
        <Logo />
      </div>
      <Card className="w-full max-w-sm">
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
      </Card>
    </div>
  );
}
