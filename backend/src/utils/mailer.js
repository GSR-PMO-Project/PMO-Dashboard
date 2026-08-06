import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter;

function getTransporter() {
  const { host, port, secure, user, pass } = env.smtp;
  if (!host || !user || !pass) {
    throw new Error(
      "SMTP is not configured. Set SMTP_HOST, SMTP_USER and SMTP_PASS in backend/.env to send email."
    );
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
  }
  return transporter;
}

export async function sendMail({ to, subject, html, text }) {
  const { fromName, fromEmail } = env.smtp;
  await getTransporter().sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject,
    html,
    text,
  });
}

export async function sendVipInvitationEmail({ invitation, conferenceName }) {
  const { email, invitee_name, invitation_code, expires_at } = invitation;

  const expiryText = expires_at ? new Date(expires_at).toLocaleDateString() : null;
  const greetingName = invitee_name || "there";

  const html = `
    <p>Hi ${greetingName},</p>
    <p>You've been invited as a VIP guest${conferenceName ? ` to <strong>${conferenceName}</strong>` : ""}.</p>
    <p>Your invitation code is: <strong style="font-size: 1.1em;">${invitation_code}</strong></p>
    ${expiryText ? `<p>This invitation is valid until ${expiryText}.</p>` : ""}
    <p>Please present this code at registration.</p>
  `;

  const text = [
    `Hi ${greetingName},`,
    `You've been invited as a VIP guest${conferenceName ? ` to ${conferenceName}` : ""}.`,
    `Your invitation code is: ${invitation_code}`,
    expiryText ? `This invitation is valid until ${expiryText}.` : null,
    `Please present this code at registration.`,
  ]
    .filter(Boolean)
    .join("\n");

  await sendMail({ to: email, subject: "You're invited as a VIP guest", html, text });
}
