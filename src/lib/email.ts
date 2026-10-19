import "server-only";
import nodemailer from "nodemailer";
import { config } from "./config";

type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

// Never throws on missing SMTP config — prints to the server console
// instead, so password reset can be tested locally with nothing set up.
export async function sendEmail({ to, subject, text, html }: SendEmailInput): Promise<void> {
  if (!config.smtp.host || !config.smtp.user || !config.smtp.pass) {
    console.log("\n===== EMAIL (console fallback — no SMTP configured) =====");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(text);
    console.log("===========================================================\n");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: { user: config.smtp.user, pass: config.smtp.pass },
  });

  await transporter.sendMail({
    from: config.smtp.from,
    to,
    subject,
    text,
    html,
  });
}
