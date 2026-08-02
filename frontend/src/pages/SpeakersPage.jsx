import { useEffect, useState } from "react";
import { Plus, Search, Link } from "lucide-react";

import { apiFetch } from "../lib/api";
import { supabase } from "../lib/supabaseClient";

import SpeakerForm from "../components/UI/SpeakerForm";
import ConfirmDialog from "../components/UI/ConfirmDialog";
import Toast from "../components/UI/Toast";

import "../styles/SpeakersPage.css";



function SpeakersPage() {
   const [speakers, setSpeakers] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [searchValue, setSearchValue] = useState("");

  const [showSpeakerForm, setShowSpeakerForm] = useState(false);
  const [speakerToEdit, setSpeakerToEdit] = useState(null);
  const [speakerToDelete, setSpeakerToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

  useEffect(() => {
  let isMounted = true;

  async function loadSpeakers() {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token;

      if (!token) {
        throw new Error("No authenticated user session found.");
      }

      const speakersResponse = await apiFetch(
        "/api/speakers",
        {},
        token
      );

      if (isMounted) {
        setSpeakers(speakersResponse);
        console.log(speakersResponse);
      }
    } catch (error) {
      console.error("Failed to load speakers:", error);

      if (isMounted) {
        setError(
          error.message || "Unable to load speakers."
        );
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  }

  loadSpeakers();

  return () => {
    isMounted = false;
  };
}, []);

  function showSuccessToast(message) {
    setToast({
      message,
      type: "success",
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  }

  async function handleSpeakerSubmit(formData) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const token = session?.access_token;

    if (!token) {
      throw new Error("No authenticated user session found.");
    }

    const conferences = await apiFetch(
      "/api/conferences",
      {},
      token
    );

    const activeConference = conferences.find(
      (conference) => conference.is_active
    );

    if (!activeConference) {
      throw new Error("No active conference was found.");
    }

    const savedSpeaker = await apiFetch(
      speakerToEdit
        ? `/api/speakers/${speakerToEdit.id}`
        : "/api/speakers",
      {
        method: speakerToEdit ? "PATCH" : "POST",
        body: JSON.stringify({
          ...formData,
          conference_id:
            speakerToEdit?.conference_id ??
            activeConference.id,
        }),
      },
      token
    );

    if (speakerToEdit) {
      setSpeakers((previous) =>
        previous.map((speaker) =>
          speaker.id === speakerToEdit.id
            ? savedSpeaker
            : speaker
        )
      );
    } else {
      setSpeakers((previous) => [
        ...previous,
        savedSpeaker,
      ]);
    }

    setShowSpeakerForm(false);
    setSpeakerToEdit(null);

    showSuccessToast(
      speakerToEdit
        ? "Speaker updated successfully."
        : "Speaker added successfully."
    );

    return true;
  } catch (error) {
    console.error("Failed to save speaker:", error);

    setToast({
      message: error.message,
      type: "error",
    });

    return false;
  }
}

  function closeSpeakerForm() {
    setShowSpeakerForm(false);
    setSpeakerToEdit(null);
  }

  async function handleDeleteSpeaker() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const token = session?.access_token;

    if (!token) {
      throw new Error("No authenticated user session found.");
    }

    await apiFetch(
      `/api/speakers/${speakerToDelete.id}`,
      {
        method: "DELETE",
      },
      token
    );

    setSpeakers((previous) =>
      previous.filter(
        (speaker) => speaker.id !== speakerToDelete.id
      )
    );

    setSpeakerToDelete(null);

    showSuccessToast("Speaker deleted successfully.");
  } catch (error) {
    console.error("Failed to delete speaker:", error);

    setToast({
      message: error.message,
      type: "error",
    });
  }
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
                {getInitials(speaker.name)}
              </div>

              {speaker.is_featured && (
                <span className="featured-badge">
                  ★ Featured
                </span>
              )}
            </div>

            <div className="speaker-info">
              <h3>{speaker.name}</h3>
              <p>
              {speaker.title || "No title"}
              {speaker.company ? ` · ${speaker.company}` : ""}
              </p>
            </div>

            <div className="speaker-meta">
              <span className="sessions-badge">
                  Sessions: —
              </span>

              {(speaker.linkedin_url ||
                speaker.twitter_handle ||
                speaker.website_url) && (
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