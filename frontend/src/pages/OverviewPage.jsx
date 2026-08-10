import { useEffect, useState } from "react";

import {
  CalendarDays,
  Users,
  ScanLine,
  Clock3,
} from "lucide-react";

import StatCard from "../components/UI/StatCard";
import ConferenceHealth from "../components/UI/ConferenceHealth";
import CheckinActivity from "../components/UI/CheckinActivity";
import RecentActivity from "../components/UI/RecentActivity";

import { useOverviewData } from "../hooks/useOverviewData";
import { supabase } from "../lib/supabaseClient";
import LoadingSpinner from "../components/shared/LoadingSpinner";

import "../styles/OverviewPage.css";

function OverviewPage() {
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadToken() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (isMounted) {
          setToken(session?.access_token ?? null);
        }
      } catch (error) {
        console.error(
          "Failed to load authentication session:",
          error
        );
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    }

    loadToken();

    return () => {
      isMounted = false;
    };
  }, []);

  const { data, loading, error } =
    useOverviewData(token);

  if (authLoading || loading) {
    return <LoadingSpinner fullPage text="Loading overview..." />;
  }

  if (!token) {
    return <p>No active session was found.</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const conferences = data?.conferences ?? [];
  const registrations = data?.registrations ?? [];
  const sessions = data?.sessions ?? [];
  const checkinLogs = data?.checkinLogs ?? [];
  const vipInvitations = data?.vipInvitations ?? [];
  const notifications = data?.notifications ?? [];
  const conferenceFeedback =
    data?.conferenceFeedback ?? [];

  const activeConference = conferences.find(
    (conference) => conference.is_active
  );

  const activeConferenceId = activeConference?.id;

  const conferenceRegistrations =
    activeConferenceId
      ? registrations.filter(
          (registration) =>
            registration.conference_id ===
            activeConferenceId
        )
      : registrations;

  const conferenceCheckinLogs =
    activeConferenceId
      ? checkinLogs.filter(
          (log) =>
            log.conference_id === activeConferenceId
        )
      : checkinLogs;

  const conferenceSessions =
    activeConferenceId
      ? sessions.filter(
          (session) =>
            session.conference_id === activeConferenceId
        )
      : sessions;

  const conferenceVipInvitations =
    activeConferenceId
      ? vipInvitations.filter(
          (invitation) =>
            invitation.conference_id ===
            activeConferenceId
        )
      : vipInvitations;

  const activeConferenceFeedback =
    activeConferenceId
      ? conferenceFeedback.filter(
          (feedback) =>
            feedback.conference_id ===
            activeConferenceId
        )
      : conferenceFeedback;

  const conferenceNotifications =
    activeConferenceId
      ? notifications.filter((notification) => {
          const notificationConferenceId =
            notification.data?.conference_id ??
            notification.data?.conferenceId;

          return (
            !notificationConferenceId ||
            notificationConferenceId ===
              activeConferenceId
          );
        })
      : notifications;

  const today = new Date();

  const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const checkedInToday =
    conferenceRegistrations.filter(
      (registration) => {
        if (
          !registration.checked_in ||
          !registration.checked_in_at
        ) {
          return false;
        }

        const checkedInAt = new Date(
          registration.checked_in_at
        );

        return (
          checkedInAt.getFullYear() ===
            today.getFullYear() &&
          checkedInAt.getMonth() ===
            today.getMonth() &&
          checkedInAt.getDate() ===
            today.getDate()
        );
      }
    ).length;

  const todaysSessions =
    conferenceSessions.filter(
      (session) =>
        session.session_date === localToday
    );

  const cancelledToday =
    todaysSessions.filter(
      (session) => session.is_cancelled
    ).length;

  const formatConferenceDates = (
    startDate,
    endDate
  ) => {
    if (!startDate || !endDate) {
      return "Dates unavailable";
    }

    const start = new Date(
      `${startDate}T00:00:00`
    );

    const end = new Date(
      `${endDate}T00:00:00`
    );

    const startText = start.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
      }
    );

    const endText = end.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
      }
    );

    return `${startText}–${endText}`;
  };

  return (
    <div className="overview-page">
      <div className="stats-grid">
        <StatCard
          title="Active Conference"
          value={
            activeConference?.name ??
            "No Active Conference"
          }
          subtitle={
            activeConference
              ? formatConferenceDates(
                  activeConference.start_date,
                  activeConference.end_date
                )
              : "No conference is currently active"
          }
          icon={<CalendarDays size={18} />}
          badge={
            activeConference ? "LIVE" : undefined
          }
        />

        <StatCard
          title="Total Registrations"
          value={conferenceRegistrations.length.toLocaleString()}
          subtitle="Registered attendees"
          icon={<Users size={18} />}
          badge="LIVE"
        />

        <StatCard
          title="Checked In Today"
          value={checkedInToday.toLocaleString()}
          subtitle="Today's check-ins"
          icon={<ScanLine size={18} />}
          badge="LIVE"
        />

        <StatCard
          title="Sessions Today"
          value={todaysSessions.length.toLocaleString()}
          subtitle={`${cancelledToday} cancelled`}
          icon={<Clock3 size={18} />}
          badge="LIVE"
        />
      </div>

      <div className="overview-main-grid">
        <CheckinActivity
          checkinLogs={conferenceCheckinLogs}
        />

        <ConferenceHealth
          activeConference={activeConference}
          registrations={conferenceRegistrations}
          vipInvitations={
            conferenceVipInvitations
          }
          notifications={
            conferenceNotifications
          }
          conferenceFeedback={
            activeConferenceFeedback
          }
        />
      </div>

      <RecentActivity
        checkinLogs={conferenceCheckinLogs}
      />
    </div>
  );
}

export default OverviewPage;