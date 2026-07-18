import { crudRouter } from "../utils/crudRouter.js";

const fields = [
  "conference_id",
  "user_id",
  "name",
  "title",
  "company",
  "bio",
  "image_url",
  "email",
  "twitter_handle",
  "linkedin_url",
  "website_url",
  "is_featured",
  "sort_order",
];

export const speakersRouter = crudRouter({
  table: "speakers",
  createFields: fields,
  filterFields: ["conference_id", "is_featured"],
  defaultOrder: { column: "sort_order" },
});
