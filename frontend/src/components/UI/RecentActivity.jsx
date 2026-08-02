import { useNavigate } from "react-router-dom";

import "../../styles/RecentActivity.css";

function RecentActivity({ checkinLogs = [] }) {
  const navigate = useNavigate();

  const activities = [...checkinLogs]
    .filter((log) => log.created_at)
    .sort(
      (firstLog, secondLog) =>
        new Date(secondLog.created_at) -
        new Date(firstLog.created_at)
    )
    .slice(0, 5)
    .map((log) => {
      const createdAt = new Date(log.created_at);

      const checkinType =
        log.checkin_type === "session"
          ? "Session check-in"
          : "Conference check-in";

      return {
        id: log.id,
        time: createdAt.toLocaleTimeString(
          "en-US",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        ),
        administrator:
          log.scanned_by || "system",
        action: `${checkinType} recorded`,
        module: "Check-in",
        status: "success",
      };
    });

  return (
    <div className="recent-activity">
      <div className="recent-activity-header">
        <h3>Recent Activity</h3>

        <button
          type="button"
          onClick={() => navigate("/registrations")}
        >
          View check-in logs →
        </button>
      </div>

      <div className="activity-table-wrapper">
        <table className="activity-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Administrator</th>
              <th>Action</th>
              <th>Module</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {activities.length > 0 ? (
              activities.map((activity) => (
                <tr key={activity.id}>
                  <td>{activity.time}</td>

                  <td>
                    {activity.administrator}
                  </td>

                  <td>{activity.action}</td>

                  <td>
                    <span className="module-chip">
                      {activity.module}
                    </span>
                  </td>

                  <td>
                    <span className="status-chip">
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">
                  No recent activity found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentActivity;