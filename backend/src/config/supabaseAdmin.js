import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

// service_role client - bypasses RLS. Server-side only, never expose to the browser.
export const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
