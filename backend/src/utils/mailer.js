import { Resend } from "resend";
import { env } from "../config/env.js";

let resendClient;

function getClient() {
  const { apiKey } = env.resend;
  if (!apiKey) {
    throw new Error("Resend is not configured. Set RESEND_API_KEY in backend/.env to send email.");
  }

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export async function sendMail({ to, subject, html, text }) {
  const { fromName, fromEmail } = env.resend;
  const { error } = await getClient().emails.send({
    from: `${fromName} <${fromEmail}>`,
    to,
    subject,
    html,
    text,
  });
  if (error) throw error;
}

export async function sendVipInvitationEmail({ invitation, conferenceName }) {
  const { email, invitee_name } = invitation;

  const greetingName = invitee_name || "there";
  const conferenceSuffix = conferenceName ? ` to <strong style="color:#4A2D7A;">${conferenceName}</strong>` : "";

  const html = `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>You're invited as a VIP guest${conferenceName ? ` to ${conferenceName}` : ""}</title>
    <style>
      body { margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table { border-collapse: collapse; }
      img { border: 0; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
      a { text-decoration: none; }

      @media only screen and (max-width: 600px) {
        .container { width: 100% !important; }
        .px { padding-left: 24px !important; padding-right: 24px !important; }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; background-color:#F5EDFF;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all; font-size:1px; line-height:1px; color:#F5EDFF;">
      You've been invited as a VIP guest${conferenceName ? ` to ${conferenceName}` : ""}.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5EDFF;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px; background-color:#FFFFFF; border-radius:24px; overflow:hidden; box-shadow:0 12px 32px rgba(74,45,122,0.16);">

            <!-- Gradient header -->
            <tr>
              <td style="background:#4A2D7A; background:linear-gradient(135deg, #2A1459 0%, #4A2D7A 55%, #C188EE 130%); padding:44px 40px 40px 40px;" align="center">
                <div style="font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:13px; letter-spacing:3px; font-weight:700; color:#E9D9FF; text-transform:uppercase;">
                  GSR Conference
                </div>
                <div style="font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:26px; line-height:1.3; font-weight:700; color:#FFFFFF; margin-top:12px;">
                  You're our VIP guest 🎟️
                </div>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td class="px" style="padding:40px 48px 40px 48px; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                <p style="margin:0 0 16px 0; font-size:16px; line-height:1.6; color:#1A1A1A;">
                  Hi ${greetingName},
                </p>
                <p style="margin:0 0 16px 0; font-size:15px; line-height:1.7; color:#4B5563;">
                  You've been invited as a VIP guest${conferenceSuffix}.
                </p>
                <p style="margin:0; font-size:15px; line-height:1.7; color:#4B5563;">
                  We look forward to welcoming you.
                </p>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td class="px" style="padding:0 48px;">
                <div style="height:1px; background-color:#EFE8F9; line-height:1px; font-size:0;">&nbsp;</div>
              </td>
            </tr>

            <!-- Help -->
            <tr>
              <td class="px" style="padding:24px 48px 40px 48px; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                <p style="margin:0; font-size:13px; line-height:1.7; color:#9AA4B4;">
                  Weren't expecting this invite? You can safely ignore this email.
                </p>
              </td>
            </tr>
          </table>

          <!-- Footer -->
          <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px;">
            <tr>
              <td align="center" style="padding:24px 40px 8px 40px; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                <p style="margin:0; font-size:12px; line-height:1.6; color:#9E90BC;">
                  © GSR Conference · This is an automated message, please don't reply.
                </p>
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    `Hi ${greetingName},`,
    `You've been invited as a VIP guest${conferenceName ? ` to ${conferenceName}` : ""}.`,
    `We look forward to welcoming you.`,
  ]
    .filter(Boolean)
    .join("\n");

  await sendMail({ to: email, subject: "You're invited as a VIP guest", html, text });
}

export async function sendUserInvitationEmail({ email, full_name, role, actionLink }) {
  const greetingName = full_name || "there";
  const roleLabel = role === "admin" ? "an Admin" : "a Staff member";

  const html = `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>You're invited to the GSR Admin Dashboard</title>
    <!--[if mso]>
      <style type="text/css">
        table, td, th { border-collapse: collapse; }
      </style>
    <![endif]-->
    <style>
      body { margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table { border-collapse: collapse; }
      img { border: 0; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
      a { text-decoration: none; }

      @media only screen and (max-width: 600px) {
        .container { width: 100% !important; }
        .px { padding-left: 24px !important; padding-right: 24px !important; }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; background-color:#F5EDFF;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all; font-size:1px; line-height:1px; color:#F5EDFF;">
      You've been invited to the GSR Admin Dashboard as ${roleLabel} — activate your account to set a password.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5EDFF;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px; background-color:#FFFFFF; border-radius:24px; overflow:hidden; box-shadow:0 12px 32px rgba(74,45,122,0.16);">

            <!-- Gradient header -->
            <tr>
              <td style="background:#4A2D7A; background:linear-gradient(135deg, #2A1459 0%, #4A2D7A 55%, #C188EE 130%); padding:44px 40px 40px 40px;" align="center">
                <div style="font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:13px; letter-spacing:3px; font-weight:700; color:#E9D9FF; text-transform:uppercase;">
                  GSR Admin Dashboard
                </div>
                <div style="font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:26px; line-height:1.3; font-weight:700; color:#FFFFFF; margin-top:12px;">
                  You're invited &#128273;
                </div>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td class="px" style="padding:40px 48px 8px 48px; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                <p style="margin:0 0 16px 0; font-size:16px; line-height:1.6; color:#1A1A1A;">
                  Hi ${greetingName},
                </p>
                <p style="margin:0 0 28px 0; font-size:15px; line-height:1.7; color:#4B5563;">
                  You've been invited to join the GSR Admin Dashboard as <strong style="color:#4A2D7A;">${roleLabel}</strong>. Click the button below to activate your account and set your password.
                </p>
              </td>
            </tr>

            <!-- CTA button -->
            <tr>
              <td align="center" class="px" style="padding:0 48px 8px 48px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="border-radius:12px; background:#4A2D7A;">
                      <a href="${actionLink}" style="display:inline-block; padding:16px 40px; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:15px; font-weight:700; color:#FFFFFF; border-radius:12px;">
                        Activate Account &amp; Set Password
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Expiry note -->
            <tr>
              <td align="center" class="px" style="padding:20px 48px 0 48px;">
                <p style="margin:0; font-size:13px; line-height:1.6; color:#8291A5;">
                  This invite link is single-use and will expire soon. For your security, never forward it to anyone else.
                </p>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td class="px" style="padding:32px 48px 0 48px;">
                <div style="height:1px; background-color:#EFE8F9; line-height:1px; font-size:0;">&nbsp;</div>
              </td>
            </tr>

            <!-- Help -->
            <tr>
              <td class="px" style="padding:24px 48px 40px 48px; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                <p style="margin:0 0 8px 0; font-size:13px; line-height:1.7; color:#9AA4B4;">
                  Weren't expecting this invite? You can safely ignore this email — no changes are made to your account until this link is used.
                </p>
                <p style="margin:0; font-size:12px; line-height:1.6; color:#9AA4B4; word-break:break-all;">
                  Button not working? Paste this link into your browser:<br />
                  <a href="${actionLink}" style="color:#4A2D7A;">${actionLink}</a>
                </p>
              </td>
            </tr>
          </table>

          <!-- Footer -->
          <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px;">
            <tr>
              <td align="center" style="padding:24px 40px 8px 40px; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                <p style="margin:0; font-size:12px; line-height:1.6; color:#9E90BC;">
                  © GSR Conference · This is an automated message, please don't reply.
                </p>
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    `Hi ${greetingName},`,
    `You've been invited to join the GSR Admin Dashboard as ${roleLabel}.`,
    `Activate your account and set your password: ${actionLink}`,
    "",
    `This link is single-use and will expire soon. If you weren't expecting this invite, you can safely ignore this email.`,
  ].join("\n");

  await sendMail({ to: email, subject: "You're invited to the GSR Admin Dashboard", html, text });
}
