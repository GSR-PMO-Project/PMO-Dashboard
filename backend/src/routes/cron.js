import { Router } from "express";
import { env } from "../config/env.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { syncVipRoles } from "../jobs/syncVipRoles.js";

export const cronRouter = Router();

// Triggered by Vercel Cron (see vercel.json), not by a logged-in staff member -
// Vercel sends the CRON_SECRET value as a Bearer token automatically when it's set.
cronRouter.get(
  "/sync-vip-roles",
  asyncHandler(async (req, res) => {
    if (!env.cronSecret || req.headers.authorization !== `Bearer ${env.cronSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    await syncVipRoles();
    res.json({ ok: true });
  })
);
