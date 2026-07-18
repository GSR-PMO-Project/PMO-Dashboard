import { crudRouter } from "../utils/crudRouter.js";

const fields = ["session_id", "speaker_id", "is_primary", "sort_order"];

export const sessionSpeakersRouter = crudRouter({
  table: "session_speakers",
  createFields: fields,
  filterFields: ["session_id", "speaker_id"],
  defaultOrder: { column: "sort_order" },
});
