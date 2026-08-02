import { useState } from "react";
import { X } from "lucide-react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "../../styles/ConferenceForm.css";

function ConferenceForm({
  onClose,
  onSubmit,
  initialData = null,
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    startDate: initialData?.startDate || null,
    endDate: initialData?.endDate || null,
    venue: initialData?.venue || "",
    maxAttendees: initialData?.maxAttendees || "",
  });

  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Conference name is required.";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required.";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required.";
    }

    if (
      formData.startDate &&
      formData.endDate &&
      formData.endDate < formData.startDate
    ) {
      newErrors.endDate = "End date cannot be before start date.";
    }

    if (!formData.venue.trim()) {
      newErrors.venue = "Venue is required.";
    }

    if (
      !formData.maxAttendees ||
      Number(formData.maxAttendees) <= 0
    ) {
      newErrors.maxAttendees = "Enter a valid capacity.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit?.(formData);
      onClose();
    }
  }

  return (
    <div className="conference-form-overlay">
      <div className="conference-form-modal">
        <div className="conference-form-header">
          <div>
            <h2>
              {initialData
                ? "Edit Conference"
                : "New Conference"}
            </h2>

            <p>
              {initialData
                ? "Update the conference details below."
                : "Add the conference details below."}
            </p>
          </div>

          <button
            type="button"
            className="conference-form-close"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="conference-form-field">
            <label>Conference Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. GSR Conference 2027"
            />

            {errors.name && <span>{errors.name}</span>}
          </div>

          <div className="conference-form-row">
            <div className="conference-form-field">
              <label>Start Date</label>

              <DatePicker
                selected={formData.startDate}
                onChange={(date) =>
                  setFormData((previous) => ({
                    ...previous,
                    startDate: date,
                  }))
                }
                dateFormat="MMM d, yyyy"
                placeholderText="Select start date"
              />

              {errors.startDate && (
                <span>{errors.startDate}</span>
              )}
            </div>

            <div className="conference-form-field">
              <label>End Date</label>

              <DatePicker
                selected={formData.endDate}
                onChange={(date) =>
                  setFormData((previous) => ({
                    ...previous,
                    endDate: date,
                  }))
                }
                minDate={formData.startDate}
                dateFormat="MMM d, yyyy"
                placeholderText="Select end date"
              />

              {errors.endDate && (
                <span>{errors.endDate}</span>
              )}
            </div>
          </div>

          <div className="conference-form-field">
            <label>Venue</label>

            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              placeholder="e.g. KFUPM Convention Center"
            />

            {errors.venue && <span>{errors.venue}</span>}
          </div>

          <div className="conference-form-field">
            <label>Max Attendees</label>

            <input
              type="number"
              name="maxAttendees"
              value={formData.maxAttendees}
              onChange={handleChange}
              placeholder="1500"
              min="1"
            />

            {errors.maxAttendees && (
              <span>{errors.maxAttendees}</span>
            )}
          </div>

          <div className="conference-form-actions">
            <button
              type="button"
              className="conference-form-cancel"
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
                : "Create Conference"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConferenceForm;