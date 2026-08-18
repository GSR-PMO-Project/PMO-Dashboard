import { useState, useEffect } from "react";
import { apiFetch } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import { Search } from "lucide-react";
import Modal from "../components/shared/Modal";
import FormField from "../components/shared/FormField";
import Table from "../components/shared/Table";
import Tabs from "../components/shared/Tabs";
import Toast from "../components/UI/Toast";
import ConfirmDialog from "../components/UI/ConfirmDialog";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "../styles/UsersPage.css";
import LoadingSpinner from "../components/shared/LoadingSpinner";

dayjs.extend(relativeTime);


const tabs = [
  { key: "all", label: "All" },
  { key: "admin", label: "Admin" },
  { key: "staff", label: "Staff" },
  { key: "speakers", label: "Speakers" },
  { key: "vip", label: "VIP" },
  { key: "attendees", label: "Attendees" },
];

const roleToTab = {
  admin: "admin",
  organizer: "staff",
  speaker: "speakers",
  vip: "vip",
  attendee: "attendees",
};

const emptyForm = { full_name: "", email: "", role: "organizer" };

// Only admin/staff accounts can be created from this form - speakers, VIPs and
// attendees get their profiles from signup/registration, not an admin invite.
const roleOptions = [
  { value: "admin", label: "admin" },
  { value: "organizer", label: "organizer (staff)" },
];



function getInitials(name = "") {
  if (!name.trim()) return "?";

  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function UsersPage() {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    if (!session) return;
    fetchUsers();
  }, [session]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const data = await apiFetch("/api/profiles", {}, session?.access_token);
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await apiFetch(`/api/profiles/${id}`, { method: "PATCH", body: JSON.stringify({ role: newRole }) }, session?.access_token);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, role: newRole } : u
        )
      );
    } catch (err) {
      console.error("Failed to update role:", err);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await apiFetch(`/api/profiles/${userToDelete.id}/revoke`, { method: "POST" }, session?.access_token);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setToast({ message: `${userToDelete.full_name || userToDelete.email} was deleted`, type: "success" });
    } catch (err) {
      console.error("Failed to delete user:", err);
      setToast({ message: err.message || "Failed to delete user", type: "error" });
    } finally {
      setUserToDelete(null);
    }
  };

   const openAddModal = () => {
     setForm(emptyForm);
     setShowAddModal(true);
   };

   const closeAddModal = () => {
     setShowAddModal(false);
   };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddUser = async (e) => {
      e.preventDefault();
      if (!form.full_name.trim() || !form.email.trim()) return;

      setSaving(true);
      try {
        const newUser = await apiFetch("/api/profiles/invite", { method: "POST", body: JSON.stringify(form) }, session?.access_token);
        setUsers((prev) => [...prev, newUser]);
        setShowAddModal(false);
        setToast({ message: `Invitation sent to ${form.email}`, type: "success" });
      } catch (err) {
        console.error("Failed to add user:", err);
        setToast({ message: err.message || "Failed to add user", type: "error" });
      } finally {
        setSaving(false);
      }
    };

  const filteredUsers = users
    .filter((u) => activeTab === "all" || roleToTab[u.role] === activeTab)
    .filter((u) => {
      const fullName = u.full_name || "";
      const email = u.email || "";

      return (
        fullName.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase())
      );
    });
    const columns = [
      {
        key: "name",
        label: "Name",
        render: (u) => (
          <div className="user-name-cell">
            <span className="user-avatar">{getInitials(u.full_name)}</span>
            {u.full_name || "No Name"}
          </div>
        ),
      },
      {
        key: "email",
        label: "Email",
      },
      {
        key: "role",
        label: "Role",
        render: (u) => (
          <select
            className="role-select"
            value={u.role}
            onChange={(e) => handleRoleChange(u.id, e.target.value)}
          >
            <option value="admin">admin</option>
            <option value="organizer">organizer</option>
            <option value="speaker">speaker</option>
            <option value="vip">vip</option>
            <option value="attendee">attendee</option>
          </select>
        ),
      },
      {
        key: "updated_at",
        label: "Last Active",
        className: "muted-text",
        render: (u) => dayjs(u.updated_at).fromNow(),
      },
      {
        key: "actions",
        label: "Actions",
        render: (u) => (
          <>
            <button
              className="btn-revoke"
              onClick={() => setUserToDelete(u)}
            >
              Delete
            </button>
          </>
        ),
      },
    ];

  return (
    <div className="users-page">
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="card">
        <div className="users-header">
          <h3>
            Users <span className="badge badge-purple">{filteredUsers.length}</span>
          </h3>

          <div className="users-header-actions">
            <div className="search-box">
              <Search size={14} className="search-icon" />
              <input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button className="btn-invite" onClick={openAddModal}>
                          + Add User
                        </button>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading users..." />
        ) : (
          <Table
            columns={columns}
            rows={filteredUsers}
            emptyMessage="No users found."
          />
        )}

      </div>

{showAddModal && (
  <Modal title="Add User" onClose={closeAddModal}>
    <form onSubmit={handleAddUser} className="modal-form">
      <FormField
        label="Name"
        value={form.full_name}
        onChange={(v) => handleFormChange("full_name", v)}
        required
      />

      <FormField
        label="Email"
        type="email"
        value={form.email}
        onChange={(v) => handleFormChange("email", v)}
        required
      />

      <FormField
        label="Role"
        type="select"
        value={form.role}
        onChange={(v) => handleFormChange("role", v)}
        options={roleOptions}
      />

      <div className="modal-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={closeAddModal}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="btn-invite"
          disabled={saving}
        >
          {saving ? "Adding..." : "Add User"}
        </button>
      </div>
    </form>
  </Modal>
)}

      {userToDelete && (
        <ConfirmDialog
          title="Delete User?"
          message={`Are you sure you want to delete ${userToDelete.full_name || userToDelete.email}? This permanently removes their account and access.`}
          confirmText="Delete"
          onCancel={() => setUserToDelete(null)}
          onConfirm={handleDeleteUser}
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

export default UsersPage;