import { Plus, Search, Link } from "lucide-react";
import "../styles/SpeakersPage.css";

const speakers = [
  {
    initials: "DS",
    name: "Dr. Sarah Johnson",
    role: "AI Research Lead · Tech Corp",
    sessions: "2 sessions",
    featured: true,
    social: true,
  },
  {
    initials: "DF",
    name: "Dr. Faisal Al-Otaibi",
    role: "Professor of Robotics · KFUPM",
    sessions: "1 session",
    featured: true,
    social: true,
  },
  {
    initials: "LA",
    name: "Lina Al-Harbi",
    role: "Founder & CEO · GreenLoop",
    sessions: "1 session",
    featured: false,
    social: false,
  },
  {
    initials: "OA",
    name: "Omar Al-Qahtani",
    role: "Principal Engineer · NEOM",
    sessions: "1 session",
    featured: false,
    social: true,
  },
  {
    initials: "DM",
    name: "Dr. Maya Chen",
    role: "Bioinformatics Lead · GenHealth Labs",
    sessions: "2 sessions",
    featured: true,
    social: true,
  },
  {
    initials: "YA",
    name: "Yousef Al-Dosari",
    role: "VC Partner · Nomad Ventures",
    sessions: "1 session",
    featured: false,
    social: false,
  },
];

function SpeakersPage() {
  return (
    <div className="speakers-page">
      <div className="speakers-toolbar">
        <div className="speakers-title">
          <h3>Speakers</h3>
          <span className="speakers-count">{speakers.length}</span>
        </div>

        <div className="speakers-toolbar-actions">
          <div className="speakers-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search speakers..."
            />
          </div>

          <button className="primary-button">
            <Plus size={17} />
            Add Speaker
          </button>
        </div>
      </div>

      <div className="speakers-grid">
        {speakers.map((speaker) => (
          <div className="speaker-card" key={speaker.name}>
            <div className="speaker-card-top">
              <div className="speaker-avatar">
                {speaker.initials}
              </div>

              {speaker.featured && (
                <span className="featured-badge">
                  ★ Featured
                </span>
              )}
            </div>

            <div className="speaker-info">
              <h3>{speaker.name}</h3>
              <p>{speaker.role}</p>
            </div>

            <div className="speaker-meta">
              <span className="sessions-badge">
                {speaker.sessions}
              </span>

              {speaker.social && (
                <span className="social-link">
                  <Link size={12} />
                  Social linked
                </span>
              )}
            </div>

            <div className="speaker-actions">
              <button className="speaker-edit-button">
                Edit
              </button>

              <button className="speaker-remove-button">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SpeakersPage;