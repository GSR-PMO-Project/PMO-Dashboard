import { useState } from "react";
import { Plus, Search } from "lucide-react";

import ConferenceForm from "../components/UI/ConferenceForm";
import TrackForm from "../components/UI/TrackForm";
import ConfirmDialog from "../components/UI/ConfirmDialog";
import Toast from "../components/UI/Toast";

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
  const [conferences] = useState(initialConferences);

  const [showConferenceForm, setShowConferenceForm] = useState(false);
  const [conferenceToEdit, setConferenceToEdit] = useState(null);
  const [conferenceToArchive, setConferenceToArchive] = useState(null);

  const [showTrackForm, setShowTrackForm] = useState(false);
  const [trackToEdit, setTrackToEdit] = useState(null);
  const [trackToDelete, setTrackToDelete] = useState(null);

  const [toast, setToast] = useState(null);

  function formatDate(date) {
    return date.toLocaleDateString("en-US", {
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

  function handleCreateConference(formData) {
    console.log("New conference:", formData);

    showSuccessToast("Conference created successfully.");
  }

  function handleEditConference(formData) {
    console.log("Edit conference:", formData);

    showSuccessToast("Conference updated successfully.");
  }

  function handleArchiveConference() {
    console.log("Archive:", conferenceToArchive);

    setConferenceToArchive(null);

    showSuccessToast("Conference archived successfully.");
  }

  function closeConferenceForm() {
    setShowConferenceForm(false);
    setConferenceToEdit(null);
  }

  function handleTrackSubmit(formData) {
    console.log(
      trackToEdit ? "Edit track:" : "New track:",
      formData
    );

    showSuccessToast(
      trackToEdit
        ? "Track updated successfully."
        : "Track created successfully."
    );
  }

  function closeTrackForm() {
    setShowTrackForm(false);
    setTrackToEdit(null);
  }

  function handleDeleteTrack() {
    console.log("Delete track:", trackToDelete);

    setTrackToDelete(null);

    showSuccessToast("Track deleted successfully.");
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
                  {formatDate(conference.startDate)} –{" "}
                  {formatDate(conference.endDate)}
                </span>

                <span>{conference.venue}</span>

                <span>{conference.attendees}</span>

                <span
                  className={`registration-status ${
                    conference.registration === "Open"
                      ? "registration-open"
                      : "registration-closed"
                  }`}
                >
                  {conference.registration}
                </span>

                <span
                  className={`conference-status ${
                    conference.status === "Active"
                      ? "active-status"
                      : "archived-status"
                  }`}
                >
                  {conference.status}
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
                {tracks.length}
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

            {tracks.map((track) => (
              <div
                className="track-table-row"
                key={track.name}
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

                <span>{track.conference}</span>
                <span>{track.description}</span>
                <span>{track.sessions}</span>

                <div className="conference-actions">
                  <button
                    className="edit-button"
                    onClick={() => setTrackToEdit(track)}
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