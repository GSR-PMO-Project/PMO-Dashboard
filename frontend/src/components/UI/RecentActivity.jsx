import "../../styles/RecentActivity.css";

const activities = [
  {
    time: "14:32",
    administrator: "system",
    action: "Published announcement: Lunch Break Reminder",
    module: "Communications",
    status: "success",
  },
  {
    time: "14:18",
    administrator: "staff.hala@gsr.sa",
    action: "Checked in Ahmad Al-Faraj to Deep Learning for Robotics",
    module: "Check-in",
    status: "success",
  },
  {
    time: "13:55",
    administrator: "admin@gsr.sa",
    action: "Exported analytics report (session feedback)",
    module: "Analytics",
    status: "success",
  },
  {
    time: "13:42",
    administrator: "ops@gsr.sa",
    action: "Updated user role: Noura Al-Sudairi → VIP",
    module: "Users",
    status: "success",
  },
];

function RecentActivity() {
  return (
    <div className="recent-activity">
      <div className="recent-activity-header">
        <h3>Recent Activity</h3>
        <button type="button">View check-in logs →</button>
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
            {activities.map((activity, index) => (
              <tr key={index}>
                <td>{activity.time}</td>
                <td>{activity.administrator}</td>
                <td>{activity.action}</td>
                <td>
                  <span className="module-chip">{activity.module}</span>
                </td>
                <td>
                  <span className="status-chip">{activity.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentActivity;