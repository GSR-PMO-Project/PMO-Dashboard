import { crudRouter } from "../utils/crudRouter.js";

const fields = ["conference_id", "name", "description", "color"];

export const tracksRouter = crudRouter({
  table: "tracks",
  createFields: fields,
  filterFields: ["conference_id"],
  defaultOrder: { column: "name" },
});
