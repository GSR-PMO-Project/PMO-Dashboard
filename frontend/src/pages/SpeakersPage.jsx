import { useState } from "react";
import { Plus, Search, Link } from "lucide-react";

import SpeakerForm from "../components/UI/SpeakerForm";
import ConfirmDialog from "../components/UI/ConfirmDialog";
import Toast from "../components/UI/Toast";

import "../styles/SpeakersPage.css";

const speakers = [
  {
    initials: "DS",
    name: "Dr. Sarah Johnson",
    title: "AI Research Lead",
    company: "Tech Corp",
    role: "AI Research Lead · Tech Corp",
    sessions: "2 sessions",
    featured: true,
    social: true,
    socialLink: "https://linkedin.com/",
    email: "sarah@example.com",
    bio: "",
    imageUrl: "",
    sortOrder: 1,
  },
  {
    initials: "DF",
    name: "Dr. Faisal Al-Otaibi",
    title: "Professor of Robotics",
    company: "KFUPM",
    role: "Professor of Robotics · KFUPM",
    sessions: "1 session",
    featured: true,
    social: true,
    socialLink: "https://linkedin.com/",
    email: "faisal@example.com",
    bio: "",
    imageUrl: "",
    sortOrder: 2,
  },
  {
    initials: "LA",
    name: "Lina Al-Harbi",
    title: "Founder & CEO",
    company: "GreenLoop",
    role: "Founder & CEO · GreenLoop",
    sessions: "1 session",
    featured: false,
    social: false,
    socialLink: "",
    email: "",
    bio: "",
    imageUrl: "",
    sortOrder: 3,
  },
  {
    initials: "OA",
    name: "Omar Al-Qahtani",
    title: "Principal Engineer",
    company: "NEOM",
    role: "Principal Engineer · NEOM",
    sessions: "1 session",
    featured: false,
    social: true,
    socialLink: "https://linkedin.com/",
    email: "",
    bio: "",
    imageUrl: "",
    sortOrder: 4,
  },
  {
    initials: "DM",
    name: "Dr. Maya Chen",
    title: "Bioinformatics Lead",
    company: "GenHealth Labs",
    role: "Bioinformatics Lead · GenHealth Labs",
    sessions: "2 sessions",
    featured: true,
    social: true,
    socialLink: "https://linkedin.com/",
    email: "",
    bio: "",
    imageUrl: "",
    sortOrder: 5,
  },
  {
    initials: "YA",
    name: "Yousef Al-Dosari",
    title: "VC Partner",
    company: "Nomad Ventures",
    role: "VC Partner · Nomad Ventures",
    sessions: "1 session",
    featured: false,
    social: false,
    socialLink: "",
    email: "",
    bio: "",
    imageUrl: "",
    sortOrder: 6,
  },
];

function SpeakersPage() {
  const [showSpeakerForm, setShowSpeakerForm] = useState(false);
  const [speakerToEdit, setSpeakerToEdit] = useState(null);
  const [speakerToDelete, setSpeakerToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  function showSuccessToast(message) {
    setToast({
      message,
      type: "success",
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  }

  function handleSpeakerSubmit(formData) {
    console.log(
      speakerToEdit ? "Edit speaker:" : "New speaker:",
      formData
    );

    showSuccessToast(
      speakerToEdit
        ? "Speaker updated successfully."
        : "Speaker added successfully."
    );
  }

  function closeSpeakerForm() {
    setShowSpeakerForm(false);
    setSpeakerToEdit(null);
  }

  function handleDeleteSpeaker() {
    console.log("Delete speaker:", speakerToDelete);

    setSpeakerToDelete(null);

    showSuccessToast("Speaker deleted successfully.");
  }

  return (
    <div className="speakers-page">
      <div className="speakers-toolbar">
        <div className="speakers-title">
          <h3>Speakers</h3>
          <span className="speakers-count">
            {speakers.length}
          </span>
        </div>

        <div className="speakers-toolbar-actions">
          <div className="speakers-search">
            <Search size={16} />

            <input
              type="text"
              placeholder="Search speakers..."
            />
          </div>

          <button
            className="primary-button"
            onClick={() => setShowSpeakerForm(true)}
          >
            <Plus size={17} />
            Add Speaker
          </button>
        </div>
      </div>

      <div className="speakers-grid">
        {speakers.map((speaker) => (
          <div
            className="speaker-card"
            key={speaker.name}
          >
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
              <button
                className="speaker-edit-button"
                onClick={() =>
                  setSpeakerToEdit(speaker)
                }
              >
                Edit
              </button>

              <button
                className="speaker-remove-button"
                onClick={() =>
                  setSpeakerToDelete(speaker)
                }
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {(showSpeakerForm || speakerToEdit) && (
        <SpeakerForm
          initialData={speakerToEdit}
          onClose={closeSpeakerForm}
          onSubmit={handleSpeakerSubmit}
        />
      )}

      {speakerToDelete && (
        <ConfirmDialog
          title="Delete Speaker?"
          message={`Are you sure you want to delete ${speakerToDelete.name}?`}
          confirmText="Delete"
          onCancel={() =>
            setSpeakerToDelete(null)
          }
          onConfirm={handleDeleteSpeaker}
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

export default SpeakersPage;