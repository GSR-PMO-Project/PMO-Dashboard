import { useState } from "react";
import { Plus, Search } from "lucide-react";
import "../styles/SessionsPage.css";

const sessionsByDay = {
  mon: [
    {
      time: "09:00–10:00",
      title: "Opening Keynote: Future of AI",
      type: "session",
      track: "—",
      room: "Main Hall",
      speaker: "Dr. Sarah Johnson",
      capacity: "1284 · Unlimited",
      status: "Open",
    },
    {
      time: "10:30–11:30",
      title: "Deep Learning for Robotics",
      type: "session",
      track: "Artificial Intelligence",
      room: "Hall A",
      speaker: "Dr. Faisal Al-Otaibi",
      capacity: "271/300",
      status: "Open",
    },
    {
      time: "14:00–16:00",
      title: "Hands-on ML Workshop",
      type: "workshop",
      track: "Artificial Intelligence",
      room: "Lab 101",
      speaker: "Dr. Sarah Johnson",
      capacity: "30/30",
      status: "Full",
    },
  ],

  tue: [
    {
      time: "09:30–10:30",
      title: "Sustainable Cities and Innovation",
      type: "session",
      track: "Sustainability",
      room: "Hall B",
      speaker: "Lina Al-Harbi",
      capacity: "180/220",
      status: "Open",
    },
    {
      time: "11:00–12:00",
      title: "Bioinformatics in Modern Healthcare",
      type: "session",
      track: "Healthcare & Biotechnology",
      room: "Hall A",
      speaker: "Dr. Maya Chen",
      capacity: "145/200",
      status: "Open",
    },
  ],

  wed: [
    {
      time: "10:00–11:00",
      title: "Investing in Student Innovation",
      type: "session",
      track: "—",
      room: "Main Hall",
      speaker: "Yousef Al-Dosari",
      capacity: "310/500",
      status: "Open",
    },
    {
      time: "13:00–14:00",
      title: "Closing Panel",
      type: "session",
      track: "—",
      room: "Main Hall",
      speaker: "Multiple Speakers",
      capacity: "520 · Unlimited",
      status: "Open",
    },
  ],
};


function SessionsPage() {
  const [activeDay, setActiveDay] = useState("mon");
  const sessions = sessionsByDay[activeDay];

  return (
    <div className="sessions-page">
      <div className="session-day-tabs">
        <button
          className={`session-day-tab ${
            activeDay === "mon" ? "active" : ""
          }`}
          onClick={() => setActiveDay("mon")}
        >
          Mon, Oct 26
        </button>

        <button
          className={`session-day-tab ${
            activeDay === "tue" ? "active" : ""
          }`}
          onClick={() => setActiveDay("tue")}
        >
          Tue, Oct 27
        </button>

        <button
          className={`session-day-tab ${
            activeDay === "wed" ? "active" : ""
          }`}
          onClick={() => setActiveDay("wed")}
        >
          Wed, Oct 28
        </button>
      </div>

      <div className="sessions-card">
        <div className="sessions-card-header">
          <div className="sessions-title">
            <h3>Schedule</h3>
            <span className="sessions-count">
              {sessions.length} sessions
            </span>
          </div>

          <div className="sessions-toolbar-actions">
            <div className="sessions-search">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search sessions..."
              />
            </div>

            <button className="primary-button">
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

          {sessions.map((session) => (
            <div
              className="session-table-row"
              key={`${session.time}-${session.title}`}
            >
              <span>{session.time}</span>

              <div className="session-title-cell">
                <strong>{session.title}</strong>

                <span
                  className={`session-type ${
                    session.type === "workshop"
                      ? "workshop-type"
                      : ""
                  }`}
                >
                  {session.type}
                </span>
              </div>

              <div className="session-track">
                {session.track !== "—" && (
                  <span className="track-dot"></span>
                )}
                <span>{session.track}</span>
              </div>

              <span>{session.room}</span>

              <span>{session.speaker}</span>

              <span>{session.capacity}</span>

              <span
                className={`session-status ${
                  session.status === "Full"
                    ? "full-status"
                    : "open-status"
                }`}
              >
                {session.status}
              </span>

              <div className="session-actions">
                <button className="session-edit-button">
                  Edit
                </button>

                <button className="session-cancel-button">
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SessionsPage;