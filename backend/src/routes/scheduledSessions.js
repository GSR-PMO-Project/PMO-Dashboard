import { Router } from "express";
import { supabaseAdmin } from "../config/supabaseAdmin.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Read-only: rosters, waitlist positions and attendance are written exclusively
// through register_for_session / cancel_session_registration / checkin_to_session
// (mounted under /sessions/:id/...) so capacity and waitlist-position logic stays
// in one place. This router only exposes what those functions have already written.
export const scheduledSessionsRouter = Router();

const FILTER_FIELDS = ["session_id", "user_id", "status", "attended"];

scheduledSessionsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    let query = supabaseAdmin.from("scheduled_sessions").select("*");

    for (const field of FILTER_FIELDS) {
      if (req.query[field] !== undefined) query = query.eq(field, req.query[field]);
    }

    const { data, error } = await query.order("registered_at", { ascending: true });
    if (error) throw error;
    res.json(data);
  })
);

scheduledSessionsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { data, error } = await supabaseAdmin
      .from("scheduled_sessions")
      .select("*")
      .eq("id", req.params.id)
      .single();
    if (error) throw error;
    res.json(data);
  })
);
