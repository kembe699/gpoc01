import type { Metadata } from "next";
import { AuthLayout } from "@/components/AuthLayout";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";

export const metadata: Metadata = { title: "Reset password | GPOC EVD Travel Screening" };

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <AuthLayout>
      <h1 className="text-xl font-semibold text-[var(--color-navy)]">Choose a new password</h1>
      <div className="mt-6">
        <ResetPasswordForm token={token} />
      </div>
    </AuthLayout>
  );
}
