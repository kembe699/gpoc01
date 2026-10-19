// Central place for small, env-driven settings used across the app.
// Edit the clinic contact details via .env (CLINIC_PHONE / CLINIC_EMAIL),
// not here.

export const config = {
  appUrl: process.env.APP_URL ?? "http://localhost:3000",
  allowedEmailDomain: process.env.ALLOWED_EMAIL_DOMAIN?.trim().toLowerCase() || null,
  clinic: {
    phone: process.env.CLINIC_PHONE || "+256 000 000 000",
    email: process.env.CLINIC_EMAIL || "clinic@gpoc.co.ug",
  },
  smtp: {
    host: process.env.SMTP_HOST || null,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    user: process.env.SMTP_USER || null,
    pass: process.env.SMTP_PASS || null,
    from: process.env.SMTP_FROM || "GPOC Health & Safety <no-reply@gpoc.co.ug>",
  },
  sessionSecret: process.env.SESSION_SECRET || "dev-only-insecure-secret-change-me",
} as const;
