import "../../styles/ConferenceHealth.css";

function calculatePercentage(part, total) {
  if (!total) {
    return 0;
  }

  return Math.min(
    Math.round((part / total) * 100),
    100
  );
}

function ConferenceHealth({
  activeConference,
  registrations = [],
  vipInvitations = [],
  notifications = [],
  conferenceFeedback = [],
}) {
  const maxAttendees =
    Number(activeConference?.max_attendees) || 0;

  const totalRegistrations =
    registrations.length;

  const checkedInRegistrations =
    registrations.filter(
      (registration) =>
        Boolean(registration.checked_in)
    ).length;

  const redeemedVIPInvitations =
    vipInvitations.filter(
      (invitation) =>
        Boolean(invitation.is_used)
    ).length;

  const deliveredNotifications =
    notifications.filter(
      (notification) =>
        Boolean(notification.sent_at)
    ).length;

  const capacityUtilization =
    calculatePercentage(
      totalRegistrations,
      maxAttendees
    );

  const vipRedemptionRate =
    calculatePercentage(
      redeemedVIPInvitations,
      vipInvitations.length
    );

  const checkinRate =
    calculatePercentage(
      checkedInRegistrations,
      totalRegistrations
    );

  const notificationDeliveryRate =
    calculatePercentage(
      deliveredNotifications,
      notifications.length
    );

  const feedbackResponseRate =
    calculatePercentage(
      conferenceFeedback.length,
      totalRegistrations
    );

  const healthData = [
    {
      label: "Capacity Utilization",
      value:
        maxAttendees > 0
          ? `${capacityUtilization}%`
          : "—",
      percentage: capacityUtilization,
      available: maxAttendees > 0,
    },
    {
      label: "VIP Redemption Rate",
      value:
        vipInvitations.length > 0
          ? `${vipRedemptionRate}%`
          : "—",
      percentage: vipRedemptionRate,
      available: vipInvitations.length > 0,
    },
    {
      label: "Check-in Rate",
      value:
        totalRegistrations > 0
          ? `${checkinRate}%`
          : "—",
      percentage: checkinRate,
      available: totalRegistrations > 0,
    },
    {
      label: "Notification Delivery",
      value:
        notifications.length > 0
          ? `${notificationDeliveryRate}%`
          : "—",
      percentage: notificationDeliveryRate,
      available: notifications.length > 0,
    },
    {
      label: "Feedback Response Rate",
      value:
        totalRegistrations > 0
          ? `${feedbackResponseRate}%`
          : "—",
      percentage: feedbackResponseRate,
      available: totalRegistrations > 0,
    },
  ];

  const availableValues = healthData
    .filter((item) => item.available)
    .map((item) => item.percentage);

  const averageHealth =
    availableValues.length > 0
      ? availableValues.reduce(
          (total, value) => total + value,
          0
        ) / availableValues.length
      : 0;

  let healthStatus = "No Data";

  if (availableValues.length > 0) {
    if (averageHealth >= 80) {
      healthStatus = "Excellent";
    } else if (averageHealth >= 40) {
      healthStatus = "Normal";
    } else {
      healthStatus = "Needs Attention";
    }
  }

  return (
    <div className="conference-health">
      <div className="conference-health-header">
        <h3>Conference Health</h3>

        <span className="health-status">
          {healthStatus}
        </span>
      </div>

      <div className="health-list">
        {healthData.map((item) => (
          <div
            className="health-item"
            key={item.label}
          >
            <div className="health-item-info">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>

            <div className="health-progress">
              <div
                className="health-progress-fill"
                style={{
                  width: `${item.percentage}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ConferenceHealth;