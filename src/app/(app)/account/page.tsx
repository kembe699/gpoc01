import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { AccountForm } from "@/components/AccountForm";
import { ChangePasswordForm } from "@/components/ChangePasswordForm";

export const metadata: Metadata = { title: "Account | GPOC EVD Travel Screening" };

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-8">
      <h1 className="text-2xl font-bold text-[var(--color-navy)]">Account</h1>

      <Card>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
          Your details
        </h2>
        <p className="mt-3 text-sm text-[var(--color-muted)]">
          Email (cannot be changed): <span className="text-[var(--color-navy)]">{user.email}</span>
        </p>
        <div className="mt-5">
          <AccountForm
            initial={{
              fullName: user.fullName,
              department: user.department,
              phone: user.phone,
            }}
          />
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
          Change password
        </h2>
        <div className="mt-5">
          <ChangePasswordForm />
        </div>
      </Card>
    </div>
  );
}
