import { Router } from "express";
import { supabaseAdmin } from "../config/supabaseAdmin.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Read-only pass-through to the pre-joined/aggregated Postgres views.
export const viewsRouter = Router();

const VIEW_ROUTES = {
  "sessions-with-details": "sessions_with_details",
  "speakers-with-session-count": "speakers_with_session_count",
  "session-feedback-summary": "session_feedback_summary",
  "conference-feedback-summary": "conference_feedback_summary",
};

for (const [path, view] of Object.entries(VIEW_ROUTES)) {
  viewsRouter.get(
    `/${path}`,
    asyncHandler(async (req, res) => {
      let query = supabaseAdmin.from(view).select("*");
      if (req.query.conference_id) query = query.eq("conference_id", req.query.conference_id);
      const { data, error } = await query;
      if (error) throw error;
      res.json(data);
    })
  );
}
