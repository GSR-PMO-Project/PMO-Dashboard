import { crudRouter } from "../utils/crudRouter.js";

const fields = [
  "name",
  "description",
  "start_date",
  "end_date",
  "venue_name",
  "venue_map_url",
  "live_stream_url",
  "is_active",
  "max_attendees",
  "registration_open",
];

export const conferencesRouter = crudRouter({
  table: "conferences",
  createFields: fields,
  filterFields: ["is_active", "registration_open"],
  defaultOrder: { column: "start_date", ascending: false },
});
