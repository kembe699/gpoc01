import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getScreeningForOwner } from "@/lib/data/screenings";
import { buildVerifyUrl } from "@/lib/verifyUrl";
import { generateQrPngWithLabel } from "@/lib/qr";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return new NextResponse("Not found", { status: 404 });

  const { id } = await params;
  const screening = await getScreeningForOwner(id, user.id);
  // Same 404-not-403 policy as the pass page — an unowned or nonexistent
  // ID must look identical, so IDs can't be guessed by probing this route.
  if (!screening) return new NextResponse("Not found", { status: 404 });

  const png = await generateQrPngWithLabel(buildVerifyUrl(screening.id), `GPOC-EVD-${screening.reference}`);

  // The Buffer/Blob typings disagree on ArrayBufferLike vs ArrayBuffer
  // here — a Node Buffer at runtime; TypeScript just needs reassurance.
  return new NextResponse(new Blob([png as unknown as BlobPart]), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="GPOC-EVD-${screening.reference}.png"`,
    },
  });
}
