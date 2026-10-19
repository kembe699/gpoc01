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
      <div className="border-b border-[var(--color-border)] pb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-teal)]">Account</p>
        <h1 className="mt-1.5 text-2xl font-bold text-[var(--color-navy)]">{user.fullName}</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">{user.email}</p>
      </div>

      <Card>
        <h2 className="text-base font-semibold text-[var(--color-navy)]">Your details</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Email cannot be changed here — contact the GPOC clinic if it needs to be updated.
        </p>
        <div className="mt-5 border-t border-[var(--color-border)] pt-5">
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
        <h2 className="text-base font-semibold text-[var(--color-navy)]">Change password</h2>
        <div className="mt-5 border-t border-[var(--color-border)] pt-5">
          <ChangePasswordForm />
        </div>
      </Card>
    </div>
  );
}
