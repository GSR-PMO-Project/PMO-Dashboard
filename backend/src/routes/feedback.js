import { Router } from "express";
import { supabaseAdmin } from "../config/supabaseAdmin.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const feedbackRouter = Router();

feedbackRouter.get(
  "/sessions",
  asyncHandler(async (req, res) => {
    let query = supabaseAdmin.from("session_feedback").select("*");
    if (req.query.session_id) query = query.eq("session_id", req.query.session_id);
    const { data, error } = await query.order("submitted_at", { ascending: false });
    if (error) throw error;
    res.json(data);
  })
);

feedbackRouter.get(
  "/conferences",
  asyncHandler(async (req, res) => {
    let query = supabaseAdmin.from("conference_feedback").select("*");
    if (req.query.conference_id) query = query.eq("conference_id", req.query.conference_id);
    const { data, error } = await query.order("submitted_at", { ascending: false });
    if (error) throw error;
    res.json(data);
  })
);

feedbackRouter.post(
  "/sessions",
  asyncHandler(async (req, res) => {
    const { user_id, session_id, speaker_communication_rating, session_efficiency_rating, additional_comments, is_anonymous } = req.body;
    const { data, error } = await supabaseAdmin.rpc("submit_session_feedback", {
      user_id,
      session_id,
      speaker_communication_rating,
      session_efficiency_rating,
      additional_comments,
      is_anonymous,
    });
    if (error) throw error;
    res.status(201).json(data);
  })
);

feedbackRouter.post(
  "/conferences",
  asyncHandler(async (req, res) => {
    const { user_id, conference_id, overall_rating, comments, is_anonymous } = req.body;
    const { data, error } = await supabaseAdmin.rpc("submit_conference_feedback", {
      user_id,
      conference_id,
      overall_rating,
      comments,
      is_anonymous,
    });
    if (error) throw error;
    res.status(201).json(data);
  })
);
