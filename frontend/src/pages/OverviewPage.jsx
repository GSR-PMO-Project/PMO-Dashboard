import {
  CalendarDays,
  Users,
  ScanLine,
  Clock3,
} from "lucide-react";

import StatCard from "../components/UI/StatCard";
import ConferenceHealth from "../components/UI/ConferenceHealth";
import "../styles/OverviewPage.css";
import CheckinActivity from "../components/UI/CheckinActivity";
import RecentActivity from "../components/UI/RecentActivity";

function OverviewPage() {
  return (
    <div className="overview-page">
      <div className="stats-grid">
        <StatCard
          title="Active Conference"
          value="GSR 2026"
          subtitle="Oct 26–28"
          icon={<CalendarDays size={18} />}
          badge="LIVE"
        />

        <StatCard
          title="Total Registrations"
          value="1,284"
          subtitle="+42 this week"
          icon={<Users size={18} />}
          badge="LIVE"
        />

        <StatCard
          title="Checked In Today"
          value="312"
          subtitle="+18 in last hour"
          icon={<ScanLine size={18} />}
          badge="LIVE"
        />

        <StatCard
          title="Sessions Today"
          value="6"
          subtitle="1 cancelled"
          icon={<Clock3 size={18} />}
          badge="LIVE"
        />
      </div>

      <div className="overview-main-grid">
        <CheckinActivity />

        <ConferenceHealth />
      </div>
      <RecentActivity />
    </div>
  );
}

export default OverviewPage;