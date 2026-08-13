import { useState } from "react";
import { X } from "lucide-react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "../../styles/VIPInviteForm.css";

function EditExpiryForm({ invitee, onClose, onSubmit }) {
  const [expiryDate, setExpiryDate] = useState(
    invitee.expiresAt ? new Date(invitee.expiresAt) : null
  );

  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!expiryDate) {
      setError("Expiry date is required.");
      return;
    }

    onSubmit?.(expiryDate);
    onClose();
  }

  return (
    <div className="vip-form-overlay">
      <div className="vip-form-modal">
        <div className="vip-form-header">
          <div>
            <h2>Edit Expiry Date</h2>
            <p>Update the expiration date for {invitee.name}.</p>
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
            <label>Invitation Expiry Date</label>

            <DatePicker
              selected={expiryDate}
              onChange={(date) => {
                setExpiryDate(date);
                setError("");
              }}
              minDate={new Date()}
              dateFormat="MMM d, yyyy"
              placeholderText="Select expiry date"
              className="vip-date-input"
            />

            {error && <span>{error}</span>}
          </div>

          <div className="vip-form-actions">
            <button
              type="button"
              className="vip-form-cancel"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="primary-button">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditExpiryForm;
