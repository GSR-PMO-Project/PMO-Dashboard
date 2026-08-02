import { useState } from "react";
import { X } from "lucide-react";
import "../../styles/TrackForm.css";

function TrackForm({
  onClose,
  onSubmit,
  initialData = null,
  conferences = [],
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    conference_id: initialData?.conference_id || "",
    description: initialData?.description || "",
    color: initialData?.color || "#7C3AED",
  });

  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Track name is required.";
    }

    if (!formData.conference_id) {
      newErrors.conference_id = "Conference is required.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
  const success = await onSubmit?.(formData);

console.log("Track submit returned:", success);

if (success !== false) {
  console.log("Closing form...");
  onClose();
}
}
  }

  return (
    <div className="track-form-overlay">
      <div className="track-form-modal">
        <div className="track-form-header">
          <div>
            <h2>{initialData ? "Edit Track" : "New Track"}</h2>
            <p>Add the track information below.</p>
          </div>

          <button
            type="button"
            className="track-form-close"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="track-form-field">
            <label>Track Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Artificial Intelligence"
            />

            {errors.name && <span>{errors.name}</span>}
          </div>

          <div className="track-form-field">
            <label>Conference</label>

            <select
              name="conference_id"
              value={formData.conference_id}
              onChange={handleChange}
            >
              <option value="">Select a conference</option>

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

          <div className="track-form-field">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe this track..."
              rows="4"
            />

            {errors.description && (
              <span>{errors.description}</span>
            )}
          </div>

          <div className="track-form-field">
            <label>Track Color</label>

            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
            />
          </div>

          <div className="track-form-actions">
            <button
              type="button"
              className="track-form-cancel"
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
                : "Create Track"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TrackForm;