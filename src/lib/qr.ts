import "server-only";
import QRCode from "qrcode";
import sharp from "sharp";

const ERROR_CORRECTION = "M" as const;

// For embedding directly in the pass page.
export async function generateQrDataUrl(text: string, width = 320): Promise<string> {
  return QRCode.toDataURL(text, { errorCorrectionLevel: ERROR_CORRECTION, width, margin: 1 });
}

// A clean QR image with no baked-in text — used where the reference is
// already shown as text alongside it (the PDF pass).
export async function generateQrPngBuffer(text: string, width = 400): Promise<Buffer> {
  return QRCode.toBuffer(text, { errorCorrectionLevel: ERROR_CORRECTION, width, margin: 1 });
}

// The downloadable PNG: 1024px square, with the reference number printed
// under the code.
export async function generateQrPngWithLabel(text: string, label: string): Promise<Buffer> {
  const size = 1024;
  const qrSize = 860;
  const topMargin = 40;
  const leftMargin = Math.round((size - qrSize) / 2);
  const labelTop = topMargin + qrSize + 10;
  const labelHeight = size - labelTop;

  const qrBuffer = await QRCode.toBuffer(text, {
    errorCorrectionLevel: ERROR_CORRECTION,
    width: qrSize,
    margin: 0,
  });

  const labelSvg = `
    <svg width="${size}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#ffffff" />
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
        font-family="monospace" font-size="34" fill="#1B3D66">${escapeXml(label)}</text>
    </svg>
  `;

  return sharp({
    create: { width: size, height: size, channels: 3, background: "#ffffff" },
  })
    .composite([
      { input: qrBuffer, top: topMargin, left: leftMargin },
      { input: Buffer.from(labelSvg), top: labelTop, left: 0 },
    ])
    .png()
    .toBuffer();
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
