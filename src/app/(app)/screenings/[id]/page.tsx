import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getScreeningForOwner } from "@/lib/data/screenings";
import { buildVerifyUrl } from "@/lib/verifyUrl";
import { generateQrDataUrl } from "@/lib/qr";
import { Notice } from "@/components/ui/Notice";
import { PassActions } from "@/components/PassActions";
import { PassCard } from "@/components/PassCard";
import Link from "next/link";

export const metadata: Metadata = { title: "Travel pass | GPOC EVD Travel Screening" };

export default async function ScreeningPassPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ submitted?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const { submitted } = await searchParams;

  const screening = await getScreeningForOwner(id, user.id);
  if (!screening) notFound();

  const qrDataUrl = await generateQrDataUrl(buildVerifyUrl(screening.id), 320);

  return (
    <div className="mx-auto max-w-2xl">
      {submitted === "1" && (
        <Notice tone="success" className="mb-6">
          Screening submitted.
        </Notice>
      )}

      <PassCard screening={screening} qrDataUrl={qrDataUrl} />

      <div className="no-print mt-6 flex flex-col gap-3 sm:flex-row">
        <PassActions id={screening.id} reference={screening.reference} />
      </div>

      <div className="no-print mt-6">
        <Link href="/history" className="text-sm text-[var(--color-teal)] hover:underline">
          &larr; Back to history
        </Link>
      </div>
    </div>
  );
}
