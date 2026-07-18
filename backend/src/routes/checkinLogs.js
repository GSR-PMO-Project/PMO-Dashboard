import { crudRouter } from "../utils/crudRouter.js";

// Read-only audit trail, plus manual gate check-in creation (session check-ins should
// go through POST /sessions/:id/checkin instead, which calls checkin_to_session()).
export const checkinLogsRouter = crudRouter({
  table: "checkin_logs",
  createFields: ["user_id", "conference_id", "checkin_type", "scanned_by"],
  updateFields: [],
  filterFields: ["conference_id", "session_id", "user_id", "checkin_type"],
  defaultOrder: { column: "created_at", ascending: false },
});
