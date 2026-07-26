import { useState } from "react";
import { X } from "lucide-react";

import "../../styles/SpeakerForm.css";

function SpeakerForm({
  onClose,
  onSubmit,
  initialData = null,
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    title: initialData?.title || "",
    company: initialData?.company || "",
    bio: initialData?.bio || "",
    imageUrl: initialData?.imageUrl || "",
    email: initialData?.email || "",
    socialLink: initialData?.socialLink || "",
    featured: initialData?.featured || false,
    sortOrder: initialData?.sortOrder || "",
  });

  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Speaker name is required.";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Title is required.";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company is required.";
    }

    if (
      formData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    if (
      formData.sortOrder &&
      Number(formData.sortOrder) < 0
    ) {
      newErrors.sortOrder =
        "Sort order cannot be negative.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit?.(formData);
      onClose();
    }
  }

  return (
    <div className="speaker-form-overlay">
      <div className="speaker-form-modal">
        <div className="speaker-form-header">
          <div>
            <h2>
              {initialData
                ? "Edit Speaker"
                : "Add Speaker"}
            </h2>

            <p>
              {initialData
                ? "Update the speaker information below."
                : "Add the speaker information below."}
            </p>
          </div>

          <button
            type="button"
            className="speaker-form-close"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="speaker-form-row">
            <div className="speaker-form-field">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Dr. Sarah Johnson"
              />

              {errors.name && <span>{errors.name}</span>}
            </div>

            <div className="speaker-form-field">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="speaker@example.com"
              />

              {errors.email && <span>{errors.email}</span>}
            </div>
          </div>

          <div className="speaker-form-row">
            <div className="speaker-form-field">
              <label>Title</label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. AI Research Lead"
              />

              {errors.title && <span>{errors.title}</span>}
            </div>

            <div className="speaker-form-field">
              <label>Company</label>

              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Tech Corp"
              />

              {errors.company && <span>{errors.company}</span>}
            </div>
          </div>

          <div className="speaker-form-field">
            <label>Bio</label>

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write a short speaker biography..."
              rows="4"
            />
          </div>

          <div className="speaker-form-field">
            <label>Image URL</label>

            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="speaker-form-field">
            <label>Social Link</label>

            <input
              type="url"
              name="socialLink"
              value={formData.socialLink}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/..."
            />
          </div>

          <div className="speaker-form-row">
            <label className="speaker-featured-field">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />

              <span>Featured Speaker</span>
            </label>

            <div className="speaker-form-field">
              <label>Sort Order</label>

              <input
                type="number"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />

              {errors.sortOrder && (
                <span>{errors.sortOrder}</span>
              )}
            </div>
          </div>

          <div className="speaker-form-actions">
            <button
              type="button"
              className="speaker-form-cancel"
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
                : "Add Speaker"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SpeakerForm;