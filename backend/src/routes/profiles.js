import { crudRouter } from "../utils/crudRouter.js";

// profiles are auto-created by a trigger on signup - no POST/DELETE here, admins can
// only look them up and change their role (e.g. attendee -> organizer).
export const profilesRouter = crudRouter({
  table: "profiles",
  createFields: [],
  updateFields: ["role", "full_name"],
  filterFields: ["role"],
  defaultOrder: { column: "created_at", ascending: false },
});
