import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { withRetry } from "../lib/retry";

function average(nums) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function groupRegistrationsByHour(registrations) {
  const counts = {};

  registrations.forEach((r) => {
    const hour = new Date(r.created_at).getUTCHours();
    const label = `${String(hour).padStart(2, "0")}h`;
    counts[label] = (counts[label] || 0) + 1;
  });

  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([time, value]) => ({ time, value }));
}

function filterRegistrationsByRange(registrations, range, activeConference) {
  if (range === "Last 24h") {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;

    return registrations.filter(
      (r) => new Date(r.created_at).getTime() >= cutoff
    );
  }

  if (!activeConference) return registrations;

  const dayOffset =
    {
      "Day 1": 0,
      "Day 2": 1,
      "Day 3": 2,
    }[range] ?? 0;

  const start = new Date(activeConference.start_date);
  start.setUTCDate(start.getUTCDate() + dayOffset);

  const targetDay = start.toISOString().slice(0, 10);

  return registrations.filter(
    (r) => r.created_at?.slice(0, 10) === targetDay
  );
}

export function useAnalytics(activeRange = "Last 24h") {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [registrationData, setRegistrationData] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [sessionFeedback, setSessionFeedback] = useState([]);
  const [conferenceFeedback, setConferenceFeedback] = useState([]);

  const [conferenceNameById, setConferenceNameById] = useState({});
  const [rawRegistrations, setRawRegistrations] = useState([]);
  const [conferencesList, setConferencesList] = useState([]);

  useEffect(() => {
    async function loadAnalytics() {
      setLoading(true);
      setError("");

      try {
        const [
          registrations,
          vipInvitations,
          conferences,
          sessionFb,
          conferenceFb,
        ] = await withRetry(() =>
          Promise.all([
            api.get("/registrations"),
            api.get("/vip-invitations"),
            api.get("/conferences"),
            api.get("/views/session-feedback-summary"),
            api.get("/views/conference-feedback-summary"),
          ])
        );

        setRawRegistrations(registrations);
        setConferencesList(conferences);

        setConferenceNameById(
          Object.fromEntries(
            conferences.map((c) => [c.id, c.name])
          )
        );

        const checkedIn = registrations.filter(
          (r) => r.checked_in
        ).length;

        const checkinRate = registrations.length
          ? Math.round((checkedIn / registrations.length) * 100)
          : 0;

        const redeemed = vipInvitations.filter(
          (v) => v.is_used
        ).length;

        const vipRate = vipInvitations.length
          ? Math.round((redeemed / vipInvitations.length) * 100)
          : 0;

        const avgSessionRating = average(
          sessionFb
            .map((s) => s.overall_rating)
            .filter((n) => n != null)
        );

        const avgConferenceRating = average(
          conferenceFb
            .map((c) => c.overall_rating)
            .filter((n) => n != null)
        );

        setKpis([
          {
              label: "Avg. Session Rating",
              value: sessionFb.length ? `${avgSessionRating.toFixed(1)} / 5` : "—",
              variant: "success",
          },
          {
              label: "Avg. Conference Rating",
              value: conferenceFb.length ? `${avgConferenceRating.toFixed(1)} / 5` : "—",
              variant: "success",
          },
          {
            label: "Check-in Rate",
            value: `${checkinRate}%`,
            variant: "purple",
          },
          {
            label: "Waitlist Promotions",
            value: "—",
            variant: "purple",
          },
          {
            label: "VIP Redemption Rate",
            value: `${vipRate}%`,
            variant: "warn",
          },
        ]);

        setSessionFeedback(sessionFb);
        setConferenceFeedback(conferenceFb);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  useEffect(() => {
    const activeConference =
      conferencesList.find((c) => c.is_active) || conferencesList[0];

    const filtered = filterRegistrationsByRange(
      rawRegistrations,
      activeRange,
      activeConference
    );

    setRegistrationData(groupRegistrationsByHour(filtered));
  }, [rawRegistrations, conferencesList, activeRange]);

  return {
    loading,
    error,
    registrationData,
    kpis,
    sessionFeedback,
    conferenceFeedback,
    conferenceNameById,
  };
}