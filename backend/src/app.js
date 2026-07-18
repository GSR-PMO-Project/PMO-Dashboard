import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { requireStaff } from "./middleware/requireStaff.js";
import { apiRouter } from "./routes/index.js";

export const app = express();

app.use(cors({ origin: env.frontendOrigin }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ ok: true }));

// Everything under /api talks to Supabase with the service_role key, so it must
// stay behind staff auth - there is no public/anon surface on this server.
app.use("/api", requireStaff, apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);
