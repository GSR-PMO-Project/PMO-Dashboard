import { crudRouter } from "../utils/crudRouter.js";

// is_read / read_at are set by the mobile app when the user reads it, not by admin.
const createFields = ["user_id", "title", "body", "notification_type", "data", "sent_at"];

export const notificationsRouter = crudRouter({
  table: "notifications",
  createFields,
  updateFields: ["sent_at"],
  filterFields: ["user_id", "notification_type"],
  defaultOrder: { column: "created_at", ascending: false },
});
