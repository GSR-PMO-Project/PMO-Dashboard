import { useState } from "react";
import { X } from "lucide-react";

import "../../styles/SessionForm.css";

function SessionForm({
  onClose,
  onSubmit,
  initialData = null,
  conferences = [],
  tracks = [],
}) {
  const [formData, setFormData] = useState({
    conference_id: initialData?.conference_id || "",
    track_id: initialData?.track_id || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
    session_type: initialData?.session_type || "session",
    room_name: initialData?.room_name || "",
    session_date: initialData?.session_date || "",
    start_time: initialData?.start_time?.slice(0, 5) || "",
    end_time: initialData?.end_time?.slice(0, 5) || "",
    max_capacity: initialData?.max_capacity ?? "",
    waitlist_enabled:
      initialData?.waitlist_enabled || false,
    requires_registration:
      initialData?.requires_registration || false,
  });

  const [errors, setErrors] = useState({});

  const availableTracks = formData.conference_id
    ? tracks.filter(
        (track) =>
          track.conference_id === formData.conference_id
      )
    : tracks;

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {};

    if (!formData.conference_id) {
      newErrors.conference_id =
        "Conference is required.";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Session title is required.";
    }

    if (!formData.session_type) {
      newErrors.session_type =
        "Session type is required.";
    }

    if (!formData.room_name.trim()) {
      newErrors.room_name = "Room is required.";
    }

    if (!formData.session_date) {
      newErrors.session_date =
        "Session date is required.";
    }

    if (!formData.start_time) {
      newErrors.start_time =
        "Start time is required.";
    }

    if (!formData.end_time) {
      newErrors.end_time = "End time is required.";
    }

    if (
      formData.start_time &&
      formData.end_time &&
      formData.end_time <= formData.start_time
    ) {
      newErrors.end_time =
        "End time must be after start time.";
    }

    if (
      formData.max_capacity !== "" &&
      Number(formData.max_capacity) <= 0
    ) {
      newErrors.max_capacity =
        "Capacity must be greater than zero.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const success = await onSubmit?.({
        ...formData,
        track_id: formData.track_id || null,
        max_capacity:
          formData.max_capacity === ""
            ? null
            : Number(formData.max_capacity),
      });

      if (success !== false) {
        onClose();
      }
    }
  }

  return (
    <div className="session-form-overlay">
      <div className="session-form-modal">
        <div className="session-form-header">
          <div>
            <h2>
              {initialData
                ? "Edit Session"
                : "New Session"}
            </h2>

            <p>
              {initialData
                ? "Update the session information below."
                : "Add the session information below."}
            </p>
          </div>

          <button
            type="button"
            className="session-form-close"
            onClick={onClose}
            aria-label="Close form"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="session-form-field">
            <label>Conference</label>

            <select
              name="conference_id"
              value={formData.conference_id}
              onChange={handleChange}
            >
              <option value="">
                Select a conference
              </option>

              {conferences.map((conference) => (
                <option
                  key={conference.id}
                  value={conference.id}
                >
                  {conference.name}
                </option>
              ))}
            </select>

            {errors.conference_id && (
              <span>{errors.conference_id}</span>
            )}
          </div>

          <div className="session-form-field">
            <label>Track</label>

            <select
              name="track_id"
              value={formData.track_id}
              onChange={handleChange}
            >
              <option value="">No track</option>

              {availableTracks.map((track) => (
                <option
                  key={track.id}
                  value={track.id}
                >
                  {track.name}
                </option>
              ))}
            </select>
          </div>

          <div className="session-form-field">
            <label>Session Title</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Future of Artificial Intelligence"
            />

            {errors.title && (
              <span>{errors.title}</span>
            )}
          </div>

          <div className="session-form-field">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the session..."
              rows="4"
            />
          </div>

          <div className="session-form-row">
            <div className="session-form-field">
              <label>Session Type</label>

              <select
                name="session_type"
                value={formData.session_type}
                onChange={handleChange}
              >
                <option value="session">
                  Session
                </option>
                <option value="workshop">
                  Workshop
                </option>
                <option value="keynote">
                  Keynote
                </option>
                <option value="panel">Panel</option>
              </select>

              {errors.session_type && (
                <span>{errors.session_type}</span>
              )}
            </div>

            <div className="session-form-field">
              <label>Room</label>

              <input
                type="text"
                name="room_name"
                value={formData.room_name}
                onChange={handleChange}
                placeholder="e.g. Main Hall"
              />

              {errors.room_name && (
                <span>{errors.room_name}</span>
              )}
            </div>
          </div>

          <div className="session-form-field">
            <label>Session Date</label>

            <input
              type="date"
              name="session_date"
              value={formData.session_date}
              onChange={handleChange}
            />

            {errors.session_date && (
              <span>{errors.session_date}</span>
            )}
          </div>

          <div className="session-form-row">
            <div className="session-form-field">
              <label>Start Time</label>

              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
              />

              {errors.start_time && (
                <span>{errors.start_time}</span>
              )}
            </div>

            <div className="session-form-field">
              <label>End Time</label>

              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
              />

              {errors.end_time && (
                <span>{errors.end_time}</span>
              )}
            </div>
          </div>

          <div className="session-form-field">
            <label>Maximum Capacity</label>

            <input
              type="number"
              name="max_capacity"
              value={formData.max_capacity}
              onChange={handleChange}
              placeholder="Leave empty for unlimited"
              min="1"
            />

            {errors.max_capacity && (
              <span>{errors.max_capacity}</span>
            )}
          </div>

          <div className="session-form-options">
            <label>
              <input
                type="checkbox"
                name="requires_registration"
                checked={
                  formData.requires_registration
                }
                onChange={handleChange}
              />

              <span>Requires Registration</span>
            </label>

            <label>
              <input
                type="checkbox"
                name="waitlist_enabled"
                checked={formData.waitlist_enabled}
                onChange={handleChange}
              />

              <span>Enable Waitlist</span>
            </label>
          </div>

          <div className="session-form-actions">
            <button
              type="button"
              className="session-form-cancel"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
            >
              {initialData
                ? "Save Changes"
                : "Create Session"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SessionForm;