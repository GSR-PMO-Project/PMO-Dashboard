import "../../styles/StatCard.css";

function StatCard({ title, value, subtitle, icon, badge }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-card-icon">
          {icon}
        </div>

        {badge && (
          <span className="stat-card-badge">
            {badge}
          </span>
        )}
      </div>

      <h3 className="stat-card-value">{value}</h3>
      <p className="stat-card-title">{title}</p>
      <p className="stat-card-subtitle">{subtitle}</p>
    </div>
  );
}

export default StatCard;