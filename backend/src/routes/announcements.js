import { crudRouter } from "../utils/crudRouter.js";

const fields = [
  "conference_id",
  "title",
  "content",
  "priority",
  "is_pinned",
  "published_at",
  "expires_at",
  "created_by",
];

export const announcementsRouter = crudRouter({
  table: "announcements",
  createFields: fields,
  filterFields: ["conference_id", "is_pinned"],
  defaultOrder: { column: "created_at", ascending: false },
});
