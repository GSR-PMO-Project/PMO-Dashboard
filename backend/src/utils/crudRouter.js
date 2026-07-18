import { Router } from "express";
import { supabaseAdmin } from "../config/supabaseAdmin.js";
import { asyncHandler } from "./asyncHandler.js";

function pick(source, fields) {
  const result = {};
  for (const field of fields) {
    if (Object.prototype.hasOwnProperty.call(source, field)) result[field] = source[field];
  }
  return result;
}

function throwIfError(error) {
  if (error) throw error;
}

/**
 * Generic CRUD router over a single Supabase table.
 *
 * @param table            table name
 * @param createFields     whitelist of columns accepted on POST
 * @param updateFields      whitelist of columns accepted on PATCH (defaults to createFields)
 * @param filterFields      query-string params accepted as `eq` filters on GET /
 * @param defaultOrder      { column, ascending } applied to GET /
 * @param idColumn          primary key column name (default "id")
 */
export function crudRouter({
  table,
  createFields,
  updateFields = createFields,
  filterFields = [],
  defaultOrder,
  idColumn = "id",
}) {
  const router = Router();

  router.get(
    "/",
    asyncHandler(async (req, res) => {
      let query = supabaseAdmin.from(table).select("*");

      for (const field of filterFields) {
        if (req.query[field] !== undefined) query = query.eq(field, req.query[field]);
      }
      if (defaultOrder) query = query.order(defaultOrder.column, { ascending: defaultOrder.ascending ?? true });

      const limit = Number(req.query.limit) || 50;
      const offset = Number(req.query.offset) || 0;
      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;
      throwIfError(error);
      res.json(data);
    })
  );

  router.get(
    "/:id",
    asyncHandler(async (req, res) => {
      const { data, error } = await supabaseAdmin.from(table).select("*").eq(idColumn, req.params.id).single();
      throwIfError(error);
      res.json(data);
    })
  );

  router.post(
    "/",
    asyncHandler(async (req, res) => {
      const payload = pick(req.body, createFields);
      const { data, error } = await supabaseAdmin.from(table).insert(payload).select().single();
      throwIfError(error);
      res.status(201).json(data);
    })
  );

  router.patch(
    "/:id",
    asyncHandler(async (req, res) => {
      const payload = pick(req.body, updateFields);
      const { data, error } = await supabaseAdmin
        .from(table)
        .update(payload)
        .eq(idColumn, req.params.id)
        .select()
        .single();
      throwIfError(error);
      res.json(data);
    })
  );

  router.delete(
    "/:id",
    asyncHandler(async (req, res) => {
      const { error } = await supabaseAdmin.from(table).delete().eq(idColumn, req.params.id);
      throwIfError(error);
      res.status(204).end();
    })
  );

  return router;
}
