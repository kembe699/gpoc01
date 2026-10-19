import "server-only";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { Screening } from "@prisma/client";
import { generateQrPngBuffer } from "./qr";
import { buildQrText } from "./qrText";
import { formatDate, formatDateTime, formatDuration } from "./dates";

const NAVY = rgb(0x0f / 255, 0x1e / 255, 0x2e / 255);
const MUTED = rgb(0x5b / 255, 0x6b / 255, 0x78 / 255);
const DANGER = rgb(0xb3 / 255, 0x26 / 255, 0x1e / 255);
const SUCCESS = rgb(0x1f / 255, 0x7a / 255, 0x3d / 255);
const BORDER = rgb(0xdd / 255, 0xe3 / 255, 0xe6 / 255);

function purposeLabel(purpose: string, purposeOther: string | null): string {
  if (purpose === "BUSINESS") return "Business";
  if (purpose === "LEAVE") return "Leave";
  return purposeOther || "Other";
}

// A5 (420 x 595 pt), one page: the pass card and QR, for printing or
// keeping as a PDF.
export async function generatePassPdf(screening: Screening): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([420, 595]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const mono = await pdfDoc.embedFont(StandardFonts.Courier);

  const margin = 32;
  let y = 595 - margin;

  page.drawText("GPOC", { x: margin, y, size: 20, font: bold, color: NAVY });
  page.drawText("Health & Safety", { x: margin + 56, y: y + 2, size: 10, font, color: MUTED });
  y -= 30;

  page.drawText("EVD Travel Screening Pass", { x: margin, y, size: 14, font: bold, color: NAVY });
  y -= 20;
  page.drawText(screening.reference, { x: margin, y, size: 11, font: mono, color: MUTED });
  y -= 24;

  const isClear = screening.status === "CLEAR";
  const statusText = isClear ? "No exposure reported" : "Health review needed";
  page.drawText(statusText, {
    x: margin,
    y,
    size: 11,
    font: bold,
    color: isClear ? SUCCESS : DANGER,
  });
  y -= 28;

  page.drawLine({
    start: { x: margin, y },
    end: { x: 420 - margin, y },
    thickness: 1,
    color: BORDER,
  });
  y -= 20;

  const rows: [string, string][] = [
    ["Staff name", screening.fullName],
    ["Department", screening.department],
    ["Destination", screening.destination],
    ["Purpose", purposeLabel(screening.purpose, screening.purposeOther)],
    ["Departure date", formatDate(screening.departureDate)],
    [
      "Return date",
      screening.returnDate
        ? `${formatDate(screening.returnDate)} (${formatDuration(screening.departureDate, screening.returnDate)})`
        : "—",
    ],
    ["Submitted", formatDateTime(screening.submittedAt)],
  ];

  for (const [label, value] of rows) {
    page.drawText(label, { x: margin, y, size: 9, font, color: MUTED });
    page.drawText(value, { x: margin + 130, y, size: 10, font: bold, color: NAVY });
    y -= 20;
  }

  // QR code, centred.
  const qrBuffer = await generateQrPngBuffer(buildQrText(screening), 320);
  const qrImage = await pdfDoc.embedPng(qrBuffer);
  const qrDisplaySize = 220;
  page.drawImage(qrImage, {
    x: (420 - qrDisplaySize) / 2,
    y: y - qrDisplaySize - 10,
    width: qrDisplaySize,
    height: qrDisplaySize,
  });
  y -= qrDisplaySize + 30;

  page.drawText("Scan with any phone camera to read the summary offline.", {
    x: margin,
    y,
    size: 8,
    font,
    color: MUTED,
  });

  return pdfDoc.save();
}
