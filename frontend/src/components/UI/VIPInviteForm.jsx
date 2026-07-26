import { useState } from "react";
import { X } from "lucide-react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "../../styles/VIPInviteForm.css";

function VIPInviteForm({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    expiryDate: null,
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
      newErrors.name = "Invitee name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = "Expiry date is required.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit?.(formData);
      onClose();
    }
  }

  return (
    <div className="vip-form-overlay">
      <div className="vip-form-modal">
        <div className="vip-form-header">
          <div>
            <h2>New VIP Invitation</h2>
            <p>Enter the VIP guest information below.</p>
          </div>

          <button
            type="button"
            className="vip-form-close"
            onClick={onClose}
            aria-label="Close form"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="vip-form-field">
            <label htmlFor="vip-name">Invitee Name</label>

            <input
              id="vip-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Dr. Khalid Al-Harbi"
            />

            {errors.name && <span>{errors.name}</span>}
          </div>

          <div className="vip-form-field">
            <label htmlFor="vip-email">Email Address</label>

            <input
              id="vip-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="guest@example.com"
            />

            {errors.email && <span>{errors.email}</span>}
          </div>

          <div className="vip-form-field">
            <label>Invitation Expiry Date</label>

            <DatePicker
              selected={formData.expiryDate}
              onChange={(date) =>
                setFormData((previous) => ({
                  ...previous,
                  expiryDate: date,
                }))
              }
              minDate={new Date()}
              dateFormat="MMM d, yyyy"
              placeholderText="Select expiry date"
              className="vip-date-input"
            />

            {errors.expiryDate && (
              <span>{errors.expiryDate}</span>
            )}
          </div>

          <div className="vip-form-actions">
            <button
              type="button"
              className="vip-form-cancel"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
            >
              Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VIPInviteForm;