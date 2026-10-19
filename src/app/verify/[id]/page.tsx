import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getScreeningPublic } from "@/lib/data/screenings";
import { buildVerifyUrl } from "@/lib/verifyUrl";
import { generateQrDataUrl } from "@/lib/qr";
import { Notice } from "@/components/ui/Notice";
import { PassCard } from "@/components/PassCard";
import { PrintButton } from "@/components/PrintButton";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = { title: "Verify travel pass | GPOC EVD Travel Screening" };

// Public — reached by scanning a pass's QR code. No login: the screening's
// own id (long, effectively unguessable) is what protects it, same as any
// "unlisted" shared link. See getScreeningPublic for the deliberate
// exception to the usual userId-scoped queries.
export default async function VerifyScreeningPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const screening = await getScreeningPublic(id);
  if (!screening) notFound();

  const qrDataUrl = await generateQrDataUrl(buildVerifyUrl(screening.id), 320);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="no-print border-b border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="mx-auto flex h-16 max-w-2xl items-center px-4 sm:px-6">
          <Link href="/">
            <Logo />
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
        <Notice tone="info" className="mb-6">
          This is a verification view of a GPOC EVD travel screening pass — scanned from the
          traveler&apos;s QR code.
        </Notice>

        <PassCard screening={screening} qrDataUrl={qrDataUrl} />

        <div className="no-print mt-6">
          <PrintButton />
        </div>
      </main>
    </div>
  );
}
