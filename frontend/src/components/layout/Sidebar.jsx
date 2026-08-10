import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  CalendarDays,
  Mic2,
  Clock3,
  ClipboardList,
  MessageSquare,
  BarChart3,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { apiFetch } from "../../lib/api";

import gsrLogo from "../../assets/LogoWhite.png";
import "../../styles/Sidebar.css";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function Sidebar() {
  const { session, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const userCardRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      const userId = session?.user?.id;
      const token = session?.access_token;

      if (!userId || !token) return;

      try {
        const data = await apiFetch(
          `/api/profiles/${userId}`,
          {},
          token
        );

        if (isMounted) setProfile(data);
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [session?.user?.id, session?.access_token]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        userCardRef.current &&
        !userCardRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName =
    profile?.full_name?.trim() ||
    session?.user?.email ||
    "Admin User";

  const displayRole = profile?.role || "Super Admin";

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src={gsrLogo} alt="GSR logo" className="sidebar-logo" />

        <div>
          <h2>GSR</h2>
          <p>PMO Dashboard</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-section-title">MAIN</p>

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <LayoutDashboard size={18} />
          <span>Overview</span>
        </NavLink>

        <NavLink
          to="/conferences"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <CalendarDays size={18} />
          <span>Conferences</span>
        </NavLink>

        <NavLink
          to="/speakers"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Mic2 size={18} />
          <span>Speakers</span>
        </NavLink>

        <NavLink
          to="/sessions"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Clock3 size={18} />
          <span>Sessions</span>
        </NavLink>

        <p className="nav-section-title">MANAGEMENT</p>

        <NavLink
          to="/registrations"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <ClipboardList size={18} />
          <span>Registrations</span>
        </NavLink>

        <NavLink
          to="/communications"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <MessageSquare size={18} />
          <span>Communications</span>
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <BarChart3 size={18} />
          <span>Analytics</span>
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Users size={18} />
          <span>Users & Roles</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-user-wrapper" ref={userCardRef}>
        {menuOpen && (
          <div className="sidebar-user-menu">
            <button
              className="sidebar-signout-button"
              onClick={() => {
                setMenuOpen(false);
                signOut();
              }}
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        )}

        <button
          className={`sidebar-user ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <div className="user-avatar">
            {getInitials(displayName) || "AU"}
          </div>

          <div className="user-details">
            <p className="user-name">{displayName}</p>
            <span className="user-role">{displayRole}</span>
          </div>

          <span className="online-dot"></span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;