import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getScreeningForOwner } from "@/lib/data/screenings";
import { generatePassPdf } from "@/lib/pdf";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return new NextResponse("Not found", { status: 404 });

  const { id } = await params;
  const screening = await getScreeningForOwner(id, user.id);
  if (!screening) return new NextResponse("Not found", { status: 404 });

  const pdfBytes = await generatePassPdf(screening);

  // Same ArrayBufferLike/ArrayBuffer typing friction as the qr.png route.
  return new NextResponse(new Blob([pdfBytes as unknown as BlobPart]), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="GPOC-EVD-${screening.reference}.pdf"`,
    },
  });
}
