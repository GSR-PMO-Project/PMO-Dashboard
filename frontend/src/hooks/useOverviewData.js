import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

export function useOverviewData(token) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    async function fetchOverviewData() {
      try {
        setLoading(true);
        setError(null);

        const [
          conferences,
          registrations,
          sessions,
          checkinLogs,
        ] = await Promise.all([
          apiFetch("/api/conferences", {}, token),
          apiFetch("/api/registrations", {}, token),
          apiFetch("/api/sessions", {}, token),
          apiFetch("/api/checkin-logs", {}, token),
        ]);

        setData({
          conferences,
          registrations,
          sessions,
          checkinLogs,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOverviewData();
  }, [token]);

  return { data, loading, error };
}