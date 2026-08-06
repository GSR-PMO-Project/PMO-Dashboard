import "dotenv/config";

const required = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  throw new Error(
    `Missing required environment variable(s): ${missing.join(", ")}. Copy .env.example to .env and fill them in.`
  );
}

export const env = {
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  port: process.env.PORT || 4000,
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    fromName: process.env.SMTP_FROM_NAME || "PMO Dashboard",
    fromEmail: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
  },
};
