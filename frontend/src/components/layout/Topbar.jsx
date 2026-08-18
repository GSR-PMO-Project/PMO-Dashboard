import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { apiFetch } from "../../lib/api";
import "../../styles/Topbar.css";

function formatNotificationTime(dateStr) {
  if (!dateStr) return "";

  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function Topbar() {
  const location = useLocation();
  const { session } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const bellRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function loadNotifications() {
      const token = session?.access_token;
      if (!token) return;

      try {
        const data = await apiFetch(
          "/api/notifications?limit=10",
          {},
          token
        );
        if (isMounted) setNotifications(data || []);
      } catch (error) {
        console.error("Failed to load notifications:", error);
      }
    }

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, [session?.access_token]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  async function toggleRead(id, isRead) {
    const readAt = isRead ? null : new Date().toISOString();
    const previous = notifications;

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: !isRead, read_at: readAt } : n))
    );

    try {
      await apiFetch(
        `/api/notifications/${id}`,
        { method: "PATCH", body: JSON.stringify({ is_read: !isRead, read_at: readAt }) },
        session?.access_token
      );
    } catch (error) {
      console.error("Failed to update notification read state:", error);
      setNotifications(previous);
    }
  }

  function markAllAsRead() {
    notifications.filter((n) => !n.is_read).forEach((n) => toggleRead(n.id, false));
  }

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

        <div className="notification-wrapper" ref={bellRef}>
          <button
            className={`icon-button ${menuOpen ? "open" : ""}`}
            aria-label="Notifications"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="notification-dot"></span>
            )}
          </button>

          {menuOpen && (
            <div className="notification-menu">
              <div className="notification-menu-header">
                <h4>Notifications</h4>
                {unreadCount > 0 && (
                  <button className="notification-mark-all" onClick={markAllAsRead}>
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="notification-menu-list">
                {notifications.length === 0 ? (
                  <p className="notification-empty">No notifications yet.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`notification-item ${!n.is_read ? "unread" : ""}`}
                    >
                      <p className="notification-item-title">{n.title}</p>
                      <p className="notification-item-body">{n.body}</p>
                      <div className="notification-item-footer">
                        <span className="notification-item-time">
                          {formatNotificationTime(n.sent_at || n.created_at)}
                        </span>
                        <button
                          className="notification-item-toggle"
                          onClick={() => toggleRead(n.id, n.is_read)}
                        >
                          {n.is_read ? "Mark as unread" : "Mark as read"}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <Link
                to="/communications"
                className="notification-menu-footer"
                onClick={() => setMenuOpen(false)}
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;