import "../../styles/ConferenceHealth.css";

const healthData = [
  {
    label: "Capacity Utilization",
    value: "76%",
    percentage: 76,
  },
  {
    label: "VIP Redemption Rate",
    value: "50%",
    percentage: 50,
  },
  {
    label: "Check-in Rate",
    value: "68%",
    percentage: 68,
  },
  {
    label: "Notification Delivery",
    value: "99%",
    percentage: 99,
  },
  {
    label: "Feedback Response Rate",
    value: "34%",
    percentage: 34,
  },
];

function ConferenceHealth() {
  return (
    <div className="conference-health">
      <div className="conference-health-header">
        <h3>Conference Health</h3>

        <span className="health-status">Normal</span>
      </div>

      <div className="health-list">
        {healthData.map((item) => (
          <div className="health-item" key={item.label}>
            <div className="health-item-info">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>

            <div className="health-progress">
              <div
                className="health-progress-fill"
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ConferenceHealth;