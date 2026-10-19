import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { Card } from "@/components/ui/Card";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";

export const metadata: Metadata = { title: "Reset password | GPOC EVD Travel Screening" };

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="mb-8">
        <Logo />
      </div>
      <Card className="w-full max-w-sm">
        <h1 className="text-xl font-semibold text-[var(--color-navy)]">Choose a new password</h1>
        <div className="mt-6">
          <ResetPasswordForm token={token} />
        </div>
      </Card>
    </div>
  );
}
