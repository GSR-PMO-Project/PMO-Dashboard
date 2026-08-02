import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

export function useOverviewData(token) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    let isMounted = true;

    async function fetchOverviewData() {
      try {
        setLoading(true);
        setError(null);

        const [
          conferences,
          registrations,
          sessions,
          checkinLogs,
          vipInvitations,
          notifications,
          conferenceFeedback,
        ] = await Promise.all([
          apiFetch("/api/conferences", {}, token),
          apiFetch("/api/registrations", {}, token),
          apiFetch("/api/sessions", {}, token),
          apiFetch("/api/checkin-logs", {}, token),
          apiFetch("/api/vip-invitations", {}, token),
          apiFetch("/api/notifications", {}, token),
          apiFetch("/api/feedback/conferences", {}, token),
        ]);

        if (isMounted) {
          setData({
            conferences,
            registrations,
            sessions,
            checkinLogs,
            vipInvitations,
            notifications,
            conferenceFeedback,
          });
        }
      } catch (err) {
        console.error(
          "Failed to load overview data:",
          err
        );

        if (isMounted) {
          setError(
            err.message ||
              "Unable to load overview data."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchOverviewData();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return { data, loading, error };
}