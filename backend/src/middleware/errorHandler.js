// Supabase/PostgREST errors carry { message, details, hint, code }. Map common
// Postgres error codes to sensible HTTP statuses instead of a blanket 500.
function statusForCode(code) {
  switch (code) {
    case "23505": // unique_violation
      return 409;
    case "23503": // foreign_key_violation
    case "23514": // check_violation
    case "22P02": // invalid_text_representation (bad uuid, etc.)
      return 400;
    case "PGRST116": // no rows found for .single()
      return 404;
    default:
      return 500;
  }
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const code = err.code;
  const status = err.status || statusForCode(code);

  if (status === 500) {
    console.error(err);
  }

  res.status(status).json({
    error: err.message || "Unexpected server error",
    ...(err.details ? { details: err.details } : {}),
    ...(err.hint ? { hint: err.hint } : {}),
  });
}

export function notFoundHandler(req, res) {
  res.status(404).json({ error: `No route for ${req.method} ${req.originalUrl}` });
}
