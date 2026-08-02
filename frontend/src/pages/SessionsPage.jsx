import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";

import SessionForm from "../components/UI/SessionForm";
import ConfirmDialog from "../components/UI/ConfirmDialog";
import Toast from "../components/UI/Toast";

import { apiFetch } from "../lib/api";
import { supabase } from "../lib/supabaseClient";

import "../styles/SessionsPage.css";

function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [conferences, setConferences] = useState([]);
  const [tracks, setTracks] = useState([]);

  const [activeDay, setActiveDay] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [showSessionForm, setShowSessionForm] =
    useState(false);

  const [sessionToEdit, setSessionToEdit] =
    useState(null);

  const [sessionToToggle, setSessionToToggle] =
    useState(null);

  const [sessionToDelete, setSessionToDelete] =
    useState(null);

  const [toast, setToast] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function getAccessToken() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const token = session?.access_token;

    if (!token) {
      throw new Error(
        "No authenticated user session found."
      );
    }

    return token;
  }

  async function fetchSessions(token) {
    const sessionsResponse = await apiFetch(
      "/api/views/sessions-with-details",
      {},
      token
    );

    return Array.isArray(sessionsResponse)
      ? sessionsResponse
      : [];
  }

  function showToast(message, type = "success") {
    setToast({
      message,
      type,
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  }

  useEffect(() => {
    let isMounted = true;

    async function loadPageData() {
      try {
        setLoading(true);
        setError(null);

        const token = await getAccessToken();

        const [
          loadedSessions,
          conferencesResponse,
          tracksResponse,
        ] = await Promise.all([
          fetchSessions(token),
          apiFetch("/api/conferences", {}, token),
          apiFetch("/api/tracks", {}, token),
        ]);

        if (!isMounted) {
          return;
        }

        setSessions(loadedSessions);

        setConferences(
          Array.isArray(conferencesResponse)
            ? conferencesResponse
            : []
        );

        setTracks(
          Array.isArray(tracksResponse)
            ? tracksResponse
            : []
        );

        const firstSessionDate =
          loadedSessions
            .map((item) => item.session_date)
            .filter(Boolean)
            .sort()[0] || "";

        setActiveDay((previous) =>
          previous || firstSessionDate
        );
      } catch (error) {
        console.error(
          "Failed to load sessions page:",
          error
        );

        if (isMounted) {
          setError(
            error.message ||
              "Unable to load sessions."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadPageData();

    return () => {
      isMounted = false;
    };
  }, []);

  const sessionDays = useMemo(() => {
    return [
      ...new Set(
        sessions
          .map((session) => session.session_date)
          .filter(Boolean)
      ),
    ].sort();
  }, [sessions]);

  const displayedSessions = useMemo(() => {
    const normalizedSearch =
      searchValue.trim().toLowerCase();

    return sessions.filter((session) => {
      const matchesDay =
        !activeDay ||
        session.session_date === activeDay;

      const searchableText = [
        session.title,
        session.session_type,
        session.track_name,
        session.room_name,
        session.speaker_names,
        session.speakers,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        searchableText.includes(normalizedSearch);

      return matchesDay && matchesSearch;
    });
  }, [sessions, activeDay, searchValue]);

  function formatDay(dateValue) {
    if (!dateValue) {
      return "Unknown date";
    }

    return new Date(
      `${dateValue}T00:00:00`
    ).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  function formatTime(timeValue) {
    if (!timeValue) {
      return "—";
    }

    const [hours, minutes] = timeValue
      .slice(0, 5)
      .split(":");

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes),
      0,
      0
    );

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function getSessionTime(session) {
    return `${formatTime(
      session.start_time
    )}–${formatTime(session.end_time)}`;
  }

  function getTrackName(session) {
    return (
      session.track_name ||
      session.track?.name ||
      "—"
    );
  }

  function getSpeakerNames(session) {
    if (Array.isArray(session.speakers)) {
      return session.speakers
        .map((speaker) =>
          typeof speaker === "string"
            ? speaker
            : speaker.name
        )
        .filter(Boolean)
        .join(", ");
    }

    return (
      session.speaker_names ||
      session.speakers ||
      session.speaker_name ||
      "—"
    );
  }

  function getCapacity(session) {
    const currentCapacity =
      session.current_capacity ?? 0;

    if (
      session.max_capacity === null ||
      session.max_capacity === undefined
    ) {
      return `${currentCapacity} · Unlimited`;
    }

    return `${currentCapacity}/${session.max_capacity}`;
  }

  function getStatus(session) {
    if (session.is_cancelled) {
      return "Cancelled";
    }

    if (
      session.max_capacity &&
      Number(session.current_capacity) >=
        Number(session.max_capacity)
    ) {
      return "Full";
    }

    return "Open";
  }

  async function handleSessionSubmit(formData) {
    try {
      const token = await getAccessToken();
      const isEditing = Boolean(sessionToEdit);

      await apiFetch(
        isEditing
          ? `/api/sessions/${sessionToEdit.id}`
          : "/api/sessions",
        {
          method: isEditing ? "PATCH" : "POST",
          body: JSON.stringify(
            isEditing
              ? formData
              : {
                  ...formData,
                  is_cancelled: false,
                  cancellation_reason: null,
                }
          ),
        },
        token
      );

      const updatedSessions =
        await fetchSessions(token);

      setSessions(updatedSessions);
      setActiveDay(formData.session_date);

      setShowSessionForm(false);
      setSessionToEdit(null);

      showToast(
        isEditing
          ? "Session updated successfully."
          : "Session created successfully."
      );

      return true;
    } catch (error) {
      console.error(
        "Failed to save session:",
        error
      );

      showToast(
        error.message ||
          "Unable to save the session.",
        "error"
      );

      return false;
    }
  }

  function openNewSessionForm() {
    setSessionToEdit(null);
    setShowSessionForm(true);
  }

  function openEditSessionForm(session) {
    setSessionToEdit(session);
    setShowSessionForm(true);
  }

  function closeSessionForm() {
    setShowSessionForm(false);
    setSessionToEdit(null);
  }

  async function handleToggleSessionStatus() {
    if (!sessionToToggle) {
      return;
    }

    const restoring =
      Boolean(sessionToToggle.is_cancelled);

    try {
      const token = await getAccessToken();

      await apiFetch(
        `/api/sessions/${sessionToToggle.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            is_cancelled: !restoring,
            cancellation_reason: restoring
              ? null
              : "Cancelled by administrator",
          }),
        },
        token
      );

      const updatedSessions =
        await fetchSessions(token);

      setSessions(updatedSessions);
      setSessionToToggle(null);

      showToast(
        restoring
          ? "Session restored successfully."
          : "Session cancelled successfully."
      );
    } catch (error) {
      console.error(
        "Failed to change session status:",
        error
      );

      showToast(
        error.message ||
          "Unable to update the session status.",
        "error"
      );
    }
  }

  async function handleDeleteSession() {
    if (!sessionToDelete) {
      return;
    }

    try {
      const token = await getAccessToken();

      await apiFetch(
        `/api/sessions/${sessionToDelete.id}`,
        {
          method: "DELETE",
        },
        token
      );

      const deletedSessionDate =
        sessionToDelete.session_date;

      const updatedSessions =
        await fetchSessions(token);

      setSessions(updatedSessions);
      setSessionToDelete(null);

      const remainingDates = [
        ...new Set(
          updatedSessions
            .map((session) => session.session_date)
            .filter(Boolean)
        ),
      ].sort();

      if (
        activeDay === deletedSessionDate &&
        !remainingDates.includes(activeDay)
      ) {
        setActiveDay(remainingDates[0] || "");
      }

      showToast(
        "Session deleted successfully."
      );
    } catch (error) {
      console.error(
        "Failed to delete session:",
        error
      );

      showToast(
        error.message ||
          "Unable to delete the session.",
        "error"
      );
    }
  }

  if (loading) {
    return (
      <div className="sessions-page">
        <div className="sessions-card">
          <p>Loading sessions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sessions-page">
        <div className="sessions-card">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sessions-page">
      <div className="session-day-tabs">
        {sessionDays.map((date) => (
          <button
            key={date}
            type="button"
            className={`session-day-tab ${
              activeDay === date ? "active" : ""
            }`}
            onClick={() => setActiveDay(date)}
          >
            {formatDay(date)}
          </button>
        ))}
      </div>

      <div className="sessions-card">
        <div className="sessions-card-header">
          <div className="sessions-title">
            <h3>Schedule</h3>

            <span className="sessions-count">
              {displayedSessions.length} sessions
            </span>
          </div>

          <div className="sessions-toolbar-actions">
            <div className="sessions-search">
              <Search size={16} />

              <input
                type="text"
                value={searchValue}
                onChange={(event) =>
                  setSearchValue(event.target.value)
                }
                placeholder="Search sessions..."
              />
            </div>

            <button
              type="button"
              className="primary-button"
              onClick={openNewSessionForm}
            >
              <Plus size={17} />
              New Session
            </button>
          </div>
        </div>

        <div className="sessions-table">
          <div className="session-table-row session-table-head">
            <span>TIME</span>
            <span>TITLE</span>
            <span>TRACK</span>
            <span>ROOM</span>
            <span>SPEAKERS</span>
            <span>CAPACITY</span>
            <span>STATUS</span>
            <span>ACTIONS</span>
          </div>

          {displayedSessions.length > 0 ? (
            displayedSessions.map((session) => {
              const status = getStatus(session);

              return (
                <div
                  className="session-table-row"
                  key={session.id}
                >
                  <span>
                    {getSessionTime(session)}
                  </span>

                  <div className="session-title-cell">
                    <strong>
                      {session.title}
                    </strong>

                    <span
                      className={`session-type ${
                        session.session_type ===
                        "workshop"
                          ? "workshop-type"
                          : ""
                      }`}
                    >
                      {session.session_type ||
                        "session"}
                    </span>
                  </div>

                  <div className="session-track">
                    {getTrackName(session) !==
                      "—" && (
                      <span className="track-dot" />
                    )}

                    <span>
                      {getTrackName(session)}
                    </span>
                  </div>

                  <span>
                    {session.room_name || "—"}
                  </span>

                  <span>
                    {getSpeakerNames(session)}
                  </span>

                  <span>
                    {getCapacity(session)}
                  </span>

                  <span
                    className={`session-status ${
                      status === "Full"
                        ? "full-status"
                        : status === "Cancelled"
                          ? "cancelled-status"
                          : "open-status"
                    }`}
                  >
                    {status}
                  </span>

                  <div className="session-actions">
                    <button
                      type="button"
                      className="session-edit-button"
                      onClick={() =>
                        openEditSessionForm(session)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="session-cancel-button"
                      onClick={() =>
                        setSessionToToggle(session)
                      }
                    >
                      {session.is_cancelled
                        ? "Restore"
                        : "Cancel"}
                    </button>

                    <button
                      type="button"
                      className="session-delete-button"
                      onClick={() =>
                        setSessionToDelete(session)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="sessions-empty-state">
              No sessions found for this day.
            </div>
          )}
        </div>
      </div>

      {(showSessionForm || sessionToEdit) && (
        <SessionForm
          initialData={sessionToEdit}
          conferences={conferences}
          tracks={tracks}
          onClose={closeSessionForm}
          onSubmit={handleSessionSubmit}
        />
      )}

      {sessionToToggle && (
        <ConfirmDialog
          title={
            sessionToToggle.is_cancelled
              ? "Restore Session?"
              : "Cancel Session?"
          }
          message={
            sessionToToggle.is_cancelled
              ? `Are you sure you want to restore ${sessionToToggle.title}?`
              : `Are you sure you want to cancel ${sessionToToggle.title}?`
          }
          confirmText={
            sessionToToggle.is_cancelled
              ? "Restore"
              : "Cancel Session"
          }
          onCancel={() =>
            setSessionToToggle(null)
          }
          onConfirm={handleToggleSessionStatus}
        />
      )}

      {sessionToDelete && (
        <ConfirmDialog
          title="Delete Session?"
          message={`Are you sure you want to permanently delete "${sessionToDelete.title}"?`}
          confirmText="Delete"
          onCancel={() =>
            setSessionToDelete(null)
          }
          onConfirm={handleDeleteSession}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default SessionsPage;