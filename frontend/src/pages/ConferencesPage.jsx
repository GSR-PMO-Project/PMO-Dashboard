import { useState } from "react";
import { Plus, Search } from "lucide-react";

import "../styles/ConferencesPage.css";

const conferences = [
  {
    name: "GSR Conference 2026",
    dates: "Oct 26, 2026 – Oct 28, 2026",
    venue: "KFUPM Convention Center",
    attendees: "1284 / 1500",
    registration: "Open",
    status: "Active",
  },
  {
    name: "GSR Regional Meetup — Riyadh",
    dates: "Dec 2, 2026 – Dec 2, 2026",
    venue: "KAFD Conference Hall",
    attendees: "96 / 400",
    registration: "Open",
    status: "Active",
  },
  {
    name: "GSR Conference 2025",
    dates: "Oct 27, 2025 – Oct 29, 2025",
    venue: "KFUPM Convention Center",
    attendees: "1198 / 1200",
    registration: "Closed",
    status: "Archived",
  },
];

function ConferencesPage() {
  const [activeTab, setActiveTab] = useState("conferences");
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
              <span className="conference-count">3</span>
            </div>

            <div className="conferences-actions">
              <div className="conference-search">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search conferences..."
                />
              </div>

              <button className="primary-button">
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

                <span>{conference.dates}</span>

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
                  <button className="edit-button">
                    Edit
                  </button>

                  <button className="archive-button">
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
        <span className="conference-count">{tracks.length}</span>
      </div>

      <button className="primary-button">
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
        <div className="track-table-row" key={track.name}>
          <div className="track-name">
            <span
              className="track-color"
              style={{ backgroundColor: track.color }}
            ></span>

            <strong>{track.name}</strong>
          </div>

          <span>{track.conference}</span>
          <span>{track.description}</span>
          <span>{track.sessions}</span>

          <div className="conference-actions">
            <button className="edit-button">Edit</button>
            <button className="archive-button">Delete</button>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
    </div>
  );
  
}

export default ConferencesPage;