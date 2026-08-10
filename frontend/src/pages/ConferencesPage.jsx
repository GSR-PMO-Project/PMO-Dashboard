import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { apiFetch } from "../lib/api";
import { supabase } from "../lib/supabaseClient";

import ConferenceForm from "../components/UI/ConferenceForm";
import TrackForm from "../components/UI/TrackForm";
import ConfirmDialog from "../components/UI/ConfirmDialog";
import Toast from "../components/UI/Toast";
import LoadingSpinner from "../components/shared/LoadingSpinner";

import "../styles/ConferencesPage.css";

const initialConferences = [
  {
    name: "GSR Conference 2026",
    startDate: new Date(2026, 9, 26),
    endDate: new Date(2026, 9, 28),
    venue: "KFUPM Convention Center",
    maxAttendees: 1500,
    attendees: "1284 / 1500",
    registration: "Open",
    status: "Active",
  },
  {
    name: "GSR Regional Meetup — Riyadh",
    startDate: new Date(2026, 11, 2),
    endDate: new Date(2026, 11, 2),
    venue: "KAFD Conference Hall",
    maxAttendees: 400,
    attendees: "96 / 400",
    registration: "Open",
    status: "Active",
  },
  {
    name: "GSR Conference 2025",
    startDate: new Date(2025, 9, 27),
    endDate: new Date(2025, 9, 29),
    venue: "KFUPM Convention Center",
    maxAttendees: 1200,
    attendees: "1198 / 1200",
    registration: "Closed",
    status: "Archived",
  },
];

const tracks = [
  {
    name: "Artificial Intelligence",
    color: "#7C3AED",
    conference: "GSR Conference 2026",
    description: "AI, machine learning, and intelligent systems",
    sessions: 8,
  },
  {
    name: "Sustainability",
    color: "#0D9488",
    conference: "GSR Conference 2026",
    description: "Climate, energy, and sustainable innovation",
    sessions: 5,
  },
  {
    name: "Healthcare & Biotechnology",
    color: "#0EA5E9",
    conference: "GSR Conference 2026",
    description: "Medical research and biotechnology",
    sessions: 6,
  },
];

function ConferencesPage() {
  const [activeTab, setActiveTab] = useState("conferences");
  const [conferences, setConferences] = useState([]);
  const [tracksData, setTracksData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showConferenceForm, setShowConferenceForm] = useState(false);
  const [conferenceToEdit, setConferenceToEdit] = useState(null);
  const [conferenceToArchive, setConferenceToArchive] = useState(null);

  const [showTrackForm, setShowTrackForm] = useState(false);
  const [trackToEdit, setTrackToEdit] = useState(null);
  const [trackToDelete, setTrackToDelete] = useState(null);

  const [toast, setToast] = useState(null);

  useEffect(() => {
  async function loadData() {
    try {
        
        const {
      data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token;

      if (!token) {
       throw new Error("No authenticated user session found.");
      }
      const [conferencesResponse, tracksResponse] = await Promise.all([
       apiFetch("/api/conferences", {}, token),
       apiFetch("/api/tracks", {}, token),
    ]);
      console.log("Conferences:", conferencesResponse);
      console.log("Tracks:", tracksResponse);

      console.log("Start Date:", conferencesResponse[0].start_date);
console.log("End Date:", conferencesResponse[0].end_date);

      setConferences(conferencesResponse);
      setTracksData(tracksResponse);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  }

  loadData();
}, []);

  function formatDate(date) {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

  function showSuccessToast(message) {
    setToast({
      message,
      type: "success",
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  }

  async function handleCreateConference(formData) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const token = session?.access_token;

    if (!token) {
      throw new Error("No authenticated user session found.");
    }

    const newConference = await apiFetch(
      "/api/conferences",
      {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          is_active: true,
          registration_open: true,
        }),
      },
      token
    );

    setConferences((previous) => [
      newConference,
      ...previous,
    ]);

    showSuccessToast("Conference created successfully.");

    return true;
  } catch (error) {
    console.error("Failed to create conference:", error);

    setToast({
      message: error.message,
      type: "error",
    });

    return false;
  }
}

  async function handleEditConference(formData) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const token = session?.access_token;

    if (!token) {
      throw new Error("No authenticated user session found.");
    }

    const updatedConference = await apiFetch(
      `/api/conferences/${conferenceToEdit.id}`,
      {
        method: "PATCH",
        body: JSON.stringify(formData),
      },
      token
    );

    setConferences((previous) =>
      previous.map((conference) =>
        conference.id === conferenceToEdit.id
          ? updatedConference
          : conference
      )
    );

    showSuccessToast("Conference updated successfully.");

    return true;
  } catch (error) {
    console.error("Failed to update conference:", error);

    setToast({
      message: error.message,
      type: "error",
    });

    return false;
  }
}

  async function handleArchiveConference() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const token = session?.access_token;

    if (!token) {
      throw new Error("No authenticated user session found.");
    }

    const updatedConference = await apiFetch(
      `/api/conferences/${conferenceToArchive.id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          is_active: false,
        }),
      },
      token
    );

    setConferences((previous) =>
      previous.map((item) =>
        item.id === conferenceToArchive.id
          ? updatedConference
          : item
      )
    );

    setConferenceToArchive(null);
    showSuccessToast("Conference archived successfully.");
  } catch (error) {
    console.error("Failed to archive conference:", error);

    setToast({
      message: error.message,
      type: "error",
    });
  }
}

  function closeConferenceForm() {
    setShowConferenceForm(false);
    setConferenceToEdit(null);
  }

  async function handleTrackSubmit(formData) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const token = session?.access_token;

    if (!token) {
      throw new Error("No authenticated user session found.");
    }

    const savedTrack = await apiFetch(
  trackToEdit
    ? `/api/tracks/${trackToEdit.id}`
    : "/api/tracks",
  {
    method: trackToEdit ? "PATCH" : "POST",
    body: JSON.stringify(formData),
  },
  token
);

    if (trackToEdit) {
  setTracksData((previous) =>
    previous.map((track) =>
      track.id === trackToEdit.id
        ? savedTrack
        : track
    )
  );
} else {
  setTracksData((previous) => [
    savedTrack,
    ...previous,
  ]);
}
    setShowTrackForm(false);
    setTrackToEdit(null);

    showSuccessToast(
  trackToEdit
    ? "Track updated successfully."
    : "Track created successfully."
);

    return true;
  } catch (error) {
    console.error("Failed to create track:", error);

    setToast({
      message: error.message,
      type: "error",
    });

    return false;
  }
}

  function closeTrackForm() {
    setShowTrackForm(false);
    setTrackToEdit(null);
  }

  async function handleDeleteTrack() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const token = session?.access_token;

    if (!token) {
      throw new Error("No authenticated user session found.");
    }

    await apiFetch(
      `/api/tracks/${trackToDelete.id}`,
      {
        method: "DELETE",
      },
      token
    );

    setTracksData((previous) =>
      previous.filter(
        (track) => track.id !== trackToDelete.id
      )
    );

    setTrackToDelete(null);

    showSuccessToast("Track deleted successfully.");
  } catch (error) {
    console.error("Failed to delete track:", error);

    setToast({
      message: error.message,
      type: "error",
    });
  }
}

  if (loading) {
    return <LoadingSpinner fullPage text="Loading conferences..." />;
  }

  return (
    <div className="conferences-page">
      <div className="conference-tabs">
        <button
          className={`conference-tab ${
            activeTab === "conferences" ? "active" : ""
          }`}
          onClick={() => setActiveTab("conferences")}
        >
          Conferences
        </button>

        <button
          className={`conference-tab ${
            activeTab === "tracks" ? "active" : ""
          }`}
          onClick={() => setActiveTab("tracks")}
        >
          Tracks
        </button>
      </div>

      {activeTab === "conferences" && (
        <div className="conferences-card">
          <div className="conferences-card-header">
            <div className="conferences-title">
              <h3>All Conferences</h3>

              <span className="conference-count">
                {conferences.length}
              </span>
            </div>

            <div className="conferences-actions">
              <div className="conference-search">
                <Search size={16} />

                <input
                  type="text"
                  placeholder="Search conferences..."
                />
              </div>

              <button
                className="primary-button"
                onClick={() => setShowConferenceForm(true)}
              >
                <Plus size={17} />
                New Conference
              </button>
            </div>
          </div>

          <div className="conferences-table">
            <div className="conference-table-row table-head">
              <span>NAME</span>
              <span>DATES</span>
              <span>VENUE</span>
              <span>ATTENDEES</span>
              <span>REGISTRATION</span>
              <span>STATUS</span>
              <span>ACTIONS</span>
            </div>

            {conferences.map((conference) => (
              <div
                className="conference-table-row"
                key={conference.name}
              >
                <strong>{conference.name}</strong>

                <span>
                {formatDate(conference.start_date)} –{" "}
                {formatDate(conference.end_date)}
               </span>

                <span>{conference.venue_name}</span>

                <span>— / {conference.max_attendees}</span>

                <span
               className={`registration-status ${
               conference.registration_open
               ? "registration-open"
               : "registration-closed"
              }`}
               >
              {conference.registration_open ? "Open" : "Closed"}
              </span>

                <span
                 className={`conference-status ${
                 conference.is_active
                 ? "active-status"
                   : "archived-status"
                  }`}
           >
               {conference.is_active ? "Active" : "Archived"}
               </span>

                <div className="conference-actions">
                  <button
                    className="edit-button"
                    onClick={() => setConferenceToEdit(conference)}
                  >
                    Edit
                  </button>

                  <button
                    className="archive-button"
                    onClick={() =>
                      setConferenceToArchive(conference)
                    }
                  >
                    Archive
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "tracks" && (
        <div className="conferences-card">
          <div className="conferences-card-header">
            <div className="conferences-title">
              <h3>All Tracks</h3>

              <span className="conference-count">
                {tracksData.length}
              </span>
            </div>

            <button
              className="primary-button"
              onClick={() => setShowTrackForm(true)}
            >
              <Plus size={17} />
              New Track
            </button>
          </div>

          <div className="tracks-table">
            <div className="track-table-row track-table-head">
              <span>TRACK</span>
              <span>CONFERENCE</span>
              <span>DESCRIPTION</span>
              <span>SESSIONS</span>
              <span>ACTIONS</span>
            </div>

            {tracksData.map((track) => (
              <div
                className="track-table-row"
                key={track.id}
              >
                <div className="track-name">
                  <span
                    className="track-color"
                    style={{
                      backgroundColor: track.color,
                    }}
                  ></span>

                  <strong>{track.name}</strong>
                </div>

                <span>
  {
    conferences.find(
      (conference) => conference.id === track.conference_id
    )?.name || "—"
  }
</span>

<span>{track.description}</span>

<span>—</span>

                <div className="conference-actions">
                  <button
                    className="edit-button"
                    onClick={() => {
  setTrackToEdit(track);
  setShowTrackForm(true);
}}
                  >
                    Edit
                  </button>

                  <button
                    className="archive-button"
                    onClick={() => setTrackToDelete(track)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(showConferenceForm || conferenceToEdit) && (
        <ConferenceForm
          initialData={conferenceToEdit}
          onClose={closeConferenceForm}
          onSubmit={
            conferenceToEdit
              ? handleEditConference
              : handleCreateConference
          }
        />
      )}

      {(showTrackForm || trackToEdit) && (
  <TrackForm
    initialData={trackToEdit}
    conferences={conferences}
    onClose={closeTrackForm}
    onSubmit={handleTrackSubmit}
  />
)}

      {conferenceToArchive && (
        <ConfirmDialog
          title="Archive Conference?"
          message={`Are you sure you want to archive ${conferenceToArchive.name}?`}
          confirmText="Archive"
          onCancel={() => setConferenceToArchive(null)}
          onConfirm={handleArchiveConference}
        />
      )}

      {trackToDelete && (
        <ConfirmDialog
          title="Delete Track?"
          message={`Are you sure you want to delete ${trackToDelete.name}?`}
          confirmText="Delete"
          onCancel={() => setTrackToDelete(null)}
          onConfirm={handleDeleteTrack}
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

export default ConferencesPage;