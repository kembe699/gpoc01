import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getScreeningForOwner } from "@/lib/data/screenings";
import { buildQrText } from "@/lib/qrText";
import { generateQrDataUrl } from "@/lib/qr";
import { clinicalQuestions } from "@/lib/questions";
import { formatDate, formatDateTime, formatDuration } from "@/lib/dates";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Logo } from "@/components/Logo";
import { Notice } from "@/components/ui/Notice";
import { PassActions } from "@/components/PassActions";
import { FullAnswers } from "@/components/FullAnswers";
import Link from "next/link";

export const metadata: Metadata = { title: "Travel pass | GPOC EVD Travel Screening" };

function purposeLabel(purpose: string, purposeOther: string | null): string {
  if (purpose === "BUSINESS") return "Business";
  if (purpose === "LEAVE") return "Leave";
  return purposeOther || "Other";
}

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

  const qrText = buildQrText(screening);
  const qrDataUrl = await generateQrDataUrl(qrText, 320);

  return (
    <div className="mx-auto max-w-2xl">
      {submitted === "1" && (
        <Notice tone="success" className="mb-6">
          Screening submitted.
        </Notice>
      )}

      <div id="pass-card" className="rounded-[6px] border border-[var(--color-border)] bg-white p-8">
        <div className="flex items-center justify-between">
          <Logo />
          <StatusBadge status={screening.status} />
        </div>

        <h1 className="mt-6 text-xl font-semibold text-[var(--color-navy)]">
          EVD Travel Screening Pass
        </h1>
        <p className="mt-1 font-mono text-sm text-[var(--color-muted)]">{screening.reference}</p>

        <dl className="mt-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-[var(--color-muted)]">Staff name</dt>
            <dd className="font-medium text-[var(--color-navy)]">{screening.fullName}</dd>
          </div>
          <div>
            <dt className="text-[var(--color-muted)]">Department</dt>
            <dd className="font-medium text-[var(--color-navy)]">{screening.department}</dd>
          </div>
          <div>
            <dt className="text-[var(--color-muted)]">Destination</dt>
            <dd className="font-medium text-[var(--color-navy)]">{screening.destination}</dd>
          </div>
          <div>
            <dt className="text-[var(--color-muted)]">Purpose</dt>
            <dd className="font-medium text-[var(--color-navy)]">
              {purposeLabel(screening.purpose, screening.purposeOther)}
            </dd>
          </div>
          <div>
            <dt className="text-[var(--color-muted)]">Departure date</dt>
            <dd className="font-medium text-[var(--color-navy)]">
              {formatDate(screening.departureDate)}
            </dd>
          </div>
          <div>
            <dt className="text-[var(--color-muted)]">Return date</dt>
            <dd className="font-medium text-[var(--color-navy)]">
              {screening.returnDate ? formatDate(screening.returnDate) : "—"}
              {formatDuration(screening.departureDate, screening.returnDate) && (
                <span className="text-[var(--color-muted)]">
                  {" "}
                  ({formatDuration(screening.departureDate, screening.returnDate)})
                </span>
              )}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-[var(--color-muted)]">Submitted</dt>
            <dd className="font-medium text-[var(--color-navy)]">
              {formatDateTime(screening.submittedAt)}
            </dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-col items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrDataUrl}
            alt={`QR code for screening ${screening.reference}`}
            width={240}
            height={240}
            className="h-[240px] w-[240px]"
          />
          <p className="text-xs text-[var(--color-muted)]">
            Scan with any phone camera to read the summary offline.
          </p>
        </div>

        <div className="mt-8">
          <FullAnswers screening={screening} questions={clinicalQuestions} />
        </div>
      </div>

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
