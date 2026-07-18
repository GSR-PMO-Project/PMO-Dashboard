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
};
