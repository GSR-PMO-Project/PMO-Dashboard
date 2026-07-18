import { supabaseAdmin } from "../config/supabaseAdmin.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const STAFF_ROLES = new Set(["admin", "organizer"]);

// This server holds the service_role key, which bypasses RLS entirely.
// Every route behind this middleware must only be reachable by an authenticated
// admin or organizer - never expose it to attendees or unauthenticated callers.
export const requireStaff = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing Authorization bearer token" });
  }

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
  if (userError || !userData?.user) {
    return res.status(401).json({ error: "Invalid or expired session" });
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("id, email, role")
    .eq("id", userData.user.id)
    .single();

  if (profileError || !profile) {
    return res.status(403).json({ error: "No profile found for this account" });
  }

  if (!STAFF_ROLES.has(profile.role)) {
    return res.status(403).json({ error: "Admin or organizer role required" });
  }

  req.staff = profile;
  next();
});
