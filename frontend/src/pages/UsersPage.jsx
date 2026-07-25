import { useState } from "react";
import { Search } from "lucide-react";
// import { api } from "../lib/api"; // TODO: uncomment when connecting to real backend

import "../styles/UsersPage.css";

const initialUsers = [
  { id: 1, name: "Ahmad Al-Rashid", email: "admin@gsr.sa", role: "admin", lastActive: "Just now" },
  { id: 2, name: "Sara Khalid", email: "ops@gsr.sa", role: "organizer", lastActive: "2h ago" },
  { id: 3, name: "Dr. Sarah Johnson", email: "sarah.johnson@example.com", role: "speaker", lastActive: "Yesterday" },
  { id: 4, name: "Eng. Noura Al-Sudairi", email: "vip2@example.com", role: "vip", lastActive: "3d ago" },
  { id: 5, name: "Ahmad Al-Faraj", email: "ahmad.f@example.com", role: "attendee", lastActive: "1h ago" },
  { id: 6, name: "Lama Al-Otaibi", email: "lama.o@example.com", role: "attendee", lastActive: "1h ago" },
];

// TODO(API): replace initialUsers above + useState below with:
//   const [users, setUsers] = useState([]);
//   useEffect(() => { api.get("/profiles").then(setUsers); }, []);

const tabs = [
  { key: "all", label: "All" },
  { key: "staff", label: "Staff" },
  { key: "speakers", label: "Speakers" },
  { key: "vip", label: "VIP" },
  { key: "attendees", label: "Attendees" },
];

const roleToTab = {
  admin: "staff",
  organizer: "staff",
  speaker: "speakers",
  vip: "vip",
  attendee: "attendees",
};

function getInitials(name) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function UsersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState(initialUsers);

  const handleRoleChange = (id, newRole) => {
    // TODO(API): replace with await api.patch(`/profiles/${id}`, { role: newRole })
    setUsers(users.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
  };

  const handleRevoke = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  const filteredUsers = users
    .filter((u) => activeTab === "all" || roleToTab[u.role] === activeTab)
    .filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="users-page">
      <div className="users-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`users-tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

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
            <button className="btn-invite">+ Invite Admin</button>
          </div>
        </div>

        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className="user-name-cell">
                    <span className="user-avatar">{getInitials(u.name)}</span>
                    {u.name}
                  </div>
                </td>
                <td>{u.email}</td>
                <td>
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
                </td>
                <td className="muted-text">{u.lastActive}</td>
                <td>
                  <span className={`role-badge role-${u.role}`}>{u.role}</span>
                  <button className="btn-revoke" onClick={() => handleRevoke(u.id)}>
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersPage;