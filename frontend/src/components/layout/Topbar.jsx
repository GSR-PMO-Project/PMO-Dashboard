import { Bell, CircleHelp } from "lucide-react";
import { useLocation } from "react-router-dom";
import "../../styles/Topbar.css";

function Topbar() {
  const location = useLocation();

  const pageInfo = {
    "/": {
  title: "Dashboard Overview",
  subtitle: "GSR Admin Console — Global Students Research Conference",
},
    "/conferences": {
      title: "Conferences",
      subtitle: "Manage conferences and tracks.",
    },
    "/speakers": {
      title: "Speakers",
      subtitle: "Manage conference speakers.",
    },
    "/sessions": {
      title: "Sessions",
      subtitle: "Manage the conference schedule and sessions.",
    },
    "/registrations": {
      title: "Registrations",
      subtitle: "Manage attendees, VIP invitations, and check-ins.",
    },
    "/communications": {
      title: "Communications",
      subtitle: "Manage announcements and notifications.",
    },
    "/analytics": {
      title: "Analytics & Feedback",
      subtitle: "View conference performance and attendee feedback.",
    },
    "/users": {
      title: "Users & Roles",
      subtitle: "Manage users and access roles.",
    },
    "/settings": {
      title: "Settings",
      subtitle: "Manage dashboard settings and connections.",
    },
  };

  const currentPage = pageInfo[location.pathname] || pageInfo["/"];

  return (
    <header className="topbar">
      <div className="topbar-title">
        <h1>{currentPage.title}</h1>
        <p>{currentPage.subtitle}</p>
      </div>

      <div className="topbar-actions">
        <div className="live-status">
          <span className="live-dot"></span>
          Supabase RT
        </div>

        <button className="icon-button" aria-label="Notifications">
          <Bell size={18} />
          <span className="notification-dot"></span>
        </button>

        <button className="help-button">
          <CircleHelp size={17} />
          Help
        </button>
      </div>
    </header>
  );
}

export default Topbar;