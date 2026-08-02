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
    start_date: initialData?.start_date
      ? new Date(initialData.start_date)
      : null,
    end_date: initialData?.end_date
      ? new Date(initialData.end_date)
      : null,
    venue_name: initialData?.venue_name || "",
    max_attendees: initialData?.max_attendees || "",
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
      newErrors.name = "Conference name is required.";
    }

    if (!formData.start_date) {
      newErrors.start_date = "Start date is required.";
    }

    if (!formData.end_date) {
      newErrors.end_date = "End date is required.";
    }

    if (
      formData.start_date &&
      formData.end_date &&
      formData.end_date < formData.start_date
    ) {
      newErrors.end_date =
        "End date cannot be before start date.";
    }

    if (!formData.venue_name.trim()) {
      newErrors.venue_name = "Venue is required.";
    }

    if (
      !formData.max_attendees ||
      Number(formData.max_attendees) <= 0
    ) {
      newErrors.max_attendees =
        "Enter a valid capacity.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
  const success = await onSubmit?.({
    ...formData,
    start_date: formData.start_date
      .toISOString()
      .split("T")[0],
    end_date: formData.end_date
      .toISOString()
      .split("T")[0],
    max_attendees: Number(formData.max_attendees),
  });

  if (success !== false) {
    onClose();
  }
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
                selected={formData.start_date}
                onChange={(date) =>
                  setFormData((previous) => ({
                    ...previous,
                    start_date: date,
                  }))
                }
                dateFormat="MMM d, yyyy"
                placeholderText="Select start date"
              />

              {errors.start_date && (
                <span>{errors.start_date}</span>
              )}
            </div>

            <div className="conference-form-field">
              <label>End Date</label>

              <DatePicker
                selected={formData.end_date}
                onChange={(date) =>
                  setFormData((previous) => ({
                    ...previous,
                    end_date: date,
                  }))
                }
                minDate={formData.start_date}
                dateFormat="MMM d, yyyy"
                placeholderText="Select end date"
              />

              {errors.end_date && (
                <span>{errors.end_date}</span>
              )}
            </div>
          </div>

          <div className="conference-form-field">
            <label>Venue</label>

            <input
              type="text"
              name="venue_name"
              value={formData.venue_name}
              onChange={handleChange}
              placeholder="e.g. KFUPM Convention Center"
            />

            {errors.venue_name && (
              <span>{errors.venue_name}</span>
            )}
          </div>

          <div className="conference-form-field">
            <label>Max Attendees</label>

            <input
              type="number"
              name="max_attendees"
              value={formData.max_attendees}
              onChange={handleChange}
              placeholder="1500"
              min="1"
            />

            {errors.max_attendees && (
              <span>{errors.max_attendees}</span>
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