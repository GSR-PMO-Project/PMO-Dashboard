import { useEffect, useState } from "react";
import { Pin } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import "../styles/CommunicationsPage.css";
import Tabs from "../components/shared/Tabs";
import Table from "../components/shared/Table";
import Toast from "../components/shared/Toast";
import ConfirmDialog from "../components/shared/ConfirmDialog";
import { withRetry } from "../lib/retry";

const tabs = [
  { key: "announcements", label: "Announcements" },
  { key: "notifications", label: "Notifications" },
];

const emptyForm = {
  title: "",
  content: "",
  priority: "normal",
  is_pinned: false,
};

function formatDateTime(dateStr) {
  if (!dateStr) return "";

  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function CommunicationsPage() {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState("announcements");

  const [announcements, setAnnouncements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [conferenceId, setConferenceId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  function handleDelete(id) {
    setConfirmDeleteId(id);
  }

  async function confirmDelete() {
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    try {
      await api.delete(`/announcements/${id}`);
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      if (editingId === id) resetForm();
      showToast("Announcement deleted");
    } catch (err) {
      setError(err.message);
      showToast(err.message, "error");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
      setLoading(true);
      setError("");

      try {
        const [conferences, announcementsData, notificationsData] = await withRetry(() =>
          Promise.all([
            api.get("/conferences"),
            api.get("/announcements"),
            api.get("/notifications"),
          ])
        );

        const activeConference = conferences.find((c) => c.is_active) || conferences[0];

        setConferenceId(activeConference?.id ?? null);
        setAnnouncements(announcementsData);
        setNotifications(notificationsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function showToast(message, type = "success") {
    setToast({ message, type });
  }

  async function handleSave(publish) {
    if (!form.title.trim() || !form.content.trim()) return;

    setSaving(true);
    setError("");

    try {
      if (editingId) {
        const payload = {
          title: form.title,
          content: form.content,
          priority: form.priority,
          is_pinned: form.is_pinned,
        };
        if (publish) payload.published_at = new Date().toISOString();

        const updated = await api.patch(`/announcements/${editingId}`, payload);
        setAnnouncements((prev) =>
          prev.map((a) => (a.id === editingId ? updated : a))
        );
        showToast("Announcement updated successfully");
      } else {
        const payload = {
          conference_id: conferenceId,
          created_by: session?.user?.id,
          title: form.title,
          content: form.content,
          priority: form.priority,
          is_pinned: form.is_pinned,
          published_at: publish ? new Date().toISOString() : null,
        };

        const created = await api.post("/announcements", payload);
        setAnnouncements((prev) => [created, ...prev]);
        showToast(publish ? "Announcement published" : "Draft saved");
      }

      resetForm();
    } catch (err) {
      setError(err.message);
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(announcement) {
    setEditingId(announcement.id);
    setForm({
      title: announcement.title || "",
      content: announcement.content || "",
      priority: announcement.priority || "normal",
      is_pinned: !!announcement.is_pinned,
    });
  }

  const announcementColumns = [
    {
      key: "title",
      label: "Title",
      render: (a) => (
        <>
          <div className="announcement-title">{a.title}</div>
          <div className="announcement-content">{a.content}</div>
        </>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      render: (a) => (
        <span className={`priority-badge priority-${a.priority}`}>
          {a.priority}
        </span>
      ),
    },
    {
      key: "pinned",
      label: "Pinned",
      render: (a) =>
        a.is_pinned ? <Pin size={14} className="pin-icon" /> : "—",
    },
    {
      key: "status",
      label: "Status",
      render: (a) =>
        a.published_at ? (
          <span className="status-badge status-published">
            Published {formatDateTime(a.published_at)}
          </span>
        ) : (
          <span className="status-badge status-draft">Draft</span>
        ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (a) => (
        <>
          <button className="btn-edit" onClick={() => handleEdit(a)}>
            Edit
          </button>
          <button className="btn-delete" onClick={() => handleDelete(a.id)}>
            Delete
          </button>
        </>
      ),
    },
  ];

  const notificationColumns = [
    {
      key: "title",
      label: "Title",
      render: (n) => (
        <>
          <div className="announcement-title">{n.title}</div>
          <div className="announcement-content">{n.body}</div>
        </>
      ),
    },
    {
      key: "notification_type",
      label: "Type",
      render: (n) => (
        <span className="badge badge-purple">{n.notification_type}</span>
      ),
    },
    {
      key: "sent_at",
      label: "Sent",
      className: "muted-text",
      render: (n) => (n.sent_at ? formatDateTime(n.sent_at) : "Not sent"),
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="communications-page">
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {error && <p className="error-text">{error}</p>}

      {!error && activeTab === "announcements" && (
        <>
          <div className="card">
            <div className="compose-header">
              <h3>{editingId ? "Edit Announcement" : "Compose Announcement"}</h3>
              <span className="badge badge-teal">Broadcast</span>
            </div>

            <input
              className="compose-input"
              placeholder="Announcement title..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <textarea
              className="compose-textarea"
              placeholder="Write the announcement content..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />

            <div className="compose-meta">
              <label className="compose-pin">
                <input
                  type="checkbox"
                  checked={form.is_pinned}
                  onChange={(e) =>
                    setForm({ ...form, is_pinned: e.target.checked })
                  }
                />
                Pin this announcement
              </label>

              <select
                className="compose-priority"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="low">Low priority</option>
                <option value="normal">Normal priority</option>
                <option value="high">High priority</option>
                <option value="urgent">Urgent priority</option>
              </select>
            </div>

            <div className="compose-actions">
              <button
                className="btn-publish"
                disabled={saving}
                onClick={() => handleSave(true)}
              >
                {editingId ? "Update & Publish" : "Publish Now"}
              </button>
              <button
                className="btn-draft"
                disabled={saving}
                onClick={() => handleSave(false)}
              >
                {editingId ? "Save as Draft" : "Save Draft"}
              </button>
              {editingId && (
                <button className="btn-draft" onClick={resetForm} disabled={saving}>
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="card">
            <div className="list-header">
              <h3>
                All Announcements{" "}
                <span className="badge badge-teal">{announcements.length}</span>
              </h3>
            </div>

            <Table
              columns={announcementColumns}
              rows={announcements}
              emptyMessage="No announcements yet."
            />
          </div>
        </>
      )}

      {!error && activeTab === "notifications" && (
        <div className="card">
          <div className="list-header">
            <h3>
              All Notifications{" "}
              <span className="badge badge-teal">{notifications.length}</span>
            </h3>
          </div>

          <Table
            columns={notificationColumns}
            rows={notifications}
            emptyMessage="No notifications yet."
          />
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmDialog
        isOpen={confirmDeleteId !== null}
        title="Delete announcement"
        message="Are you sure you want to delete this announcement? This cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}

export default CommunicationsPage;
