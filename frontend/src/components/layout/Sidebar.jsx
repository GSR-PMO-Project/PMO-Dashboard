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
} from "lucide-react";

import gsrLogo from "../../assets/LogoWhite.png";
import "../../styles/Sidebar.css";

function Sidebar() {
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

      <div className="sidebar-user">
        <div className="user-avatar">AU</div>

        <div className="user-details">
          <p className="user-name">Admin User</p>
          <span className="user-role">Super Admin</span>
        </div>

        <span className="online-dot"></span>
      </div>
    </aside>
  );
}

export default Sidebar;