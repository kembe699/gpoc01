import { config } from "./config";

// What the QR code actually encodes — scanning it opens this page directly
// (no login required; the screening's own long, effectively-unguessable ID
// is what protects it, the same model as an "unlisted" shared link).
export function buildVerifyUrl(screeningId: string): string {
  return `${config.appUrl}/verify/${screeningId}`;
}
