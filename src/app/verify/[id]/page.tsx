import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getScreeningPublic } from "@/lib/data/screenings";
import { VerifyResult } from "@/components/VerifyResult";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = { title: "Screening result | GPOC EVD Travel Screening" };

// Public — reached by scanning a pass's QR code. No login: the screening's
// own id (long, effectively unguessable) is what protects it, same as any
// "unlisted" shared link. See getScreeningPublic for the deliberate
// exception to the usual userId-scoped queries.
//
// Deliberately minimal — someone scanning this at a checkpoint or clinic
// needs one thing, fast: is this traveller clear, or do they need to see a
// doctor. The full pass (destination, dates, every clinical answer) is the
// owner's own view at /screenings/[id], not this one.
export default async function VerifyScreeningPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const screening = await getScreeningPublic(id);
  if (!screening) notFound();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-page-bg)] px-4 py-10">
      <div className="mb-6">
        <Link href="/">
          <Logo />
        </Link>
      </div>

      <div className="w-full max-w-md">
        <VerifyResult screening={screening} />
      </div>
    </div>
  );
}
