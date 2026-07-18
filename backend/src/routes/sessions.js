import { Router } from "express";
import { supabaseAdmin } from "../config/supabaseAdmin.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { crudRouter } from "../utils/crudRouter.js";

// current_capacity is intentionally excluded - it's managed by register_for_session /
// cancel_session_registration, admins should never set it directly.
const fields = [
  "conference_id",
  "track_id",
  "title",
  "description",
  "session_type",
  "room_name",
  "session_date",
  "start_time",
  "end_time",
  "max_capacity",
  "waitlist_enabled",
  "requires_registration",
  "is_cancelled",
  "cancellation_reason",
];

export const sessionsRouter = crudRouter({
  table: "sessions",
  createFields: fields,
  filterFields: ["conference_id", "track_id", "session_date", "is_cancelled"],
  defaultOrder: { column: "session_date" },
});

// RPC endpoints layered on top of the base CRUD routes.
sessionsRouter.post(
  "/:id/register",
  asyncHandler(async (req, res) => {
    const { data, error } = await supabaseAdmin.rpc("register_for_session", {
      user_id: req.body.user_id,
      session_id: req.params.id,
    });
    if (error) throw error;
    res.json(data);
  })
);

sessionsRouter.post(
  "/:id/cancel-registration",
  asyncHandler(async (req, res) => {
    const { data, error } = await supabaseAdmin.rpc("cancel_session_registration", {
      user_id: req.body.user_id,
      session_id: req.params.id,
    });
    if (error) throw error;
    res.json(data);
  })
);

sessionsRouter.post(
  "/:id/checkin",
  asyncHandler(async (req, res) => {
    const { data, error } = await supabaseAdmin.rpc("checkin_to_session", {
      user_id: req.body.user_id,
      session_id: req.params.id,
      scanned_by: req.staff.id,
    });
    if (error) throw error;
    res.json(data);
  })
);
