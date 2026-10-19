import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ScreeningForm } from "@/components/ScreeningForm";

export const metadata: Metadata = { title: "New screening | GPOC EVD Travel Screening" };

export default async function NewScreeningPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-3xl lg:max-w-4xl">
      <h1 className="text-2xl font-bold text-[var(--color-navy)]">EVD Travel Screening</h1>
      <p className="mt-2 text-sm text-[var(--color-muted)]">
        Fields are prefilled from your profile — you can edit them for this submission only.
      </p>
      <div className="mt-8">
        <ScreeningForm
          profile={{
            fullName: user.fullName,
            department: user.department,
            phone: user.phone,
            email: user.email,
          }}
        />
      </div>
    </div>
  );
}
