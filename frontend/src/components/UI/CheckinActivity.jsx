import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "../../styles/CheckinActivity.css";

function CheckinActivity({ checkinLogs = [] }) {
  const today = new Date();

  const todaysLogs = checkinLogs.filter((log) => {
    if (!log.created_at) {
      return false;
    }

    const checkinDate = new Date(log.created_at);

    return (
      checkinDate.getFullYear() === today.getFullYear() &&
      checkinDate.getMonth() === today.getMonth() &&
      checkinDate.getDate() === today.getDate()
    );
  });

  const data = Array.from(
    { length: 9 },
    (_, index) => {
      const hour = index + 8;

      const checkins = todaysLogs.filter((log) => {
        const checkinDate = new Date(log.created_at);

        return checkinDate.getHours() === hour;
      }).length;

      return {
        time: `${String(hour).padStart(2, "0")}h`,
        checkins,
      };
    }
  );

  const peakPerHour =
    data.length > 0
      ? Math.max(...data.map((item) => item.checkins))
      : 0;

  const hoursWithActivity = data.filter(
    (item) => item.checkins > 0
  );

  const averagePerHour =
    hoursWithActivity.length > 0
      ? Math.round(
          hoursWithActivity.reduce(
            (total, item) => total + item.checkins,
            0
          ) / hoursWithActivity.length
        )
      : 0;

  const totalToday = todaysLogs.length;

  return (
    <div className="checkin-activity">
      <div className="checkin-header">
        <div>
          <h3>Check-in Activity</h3>
          <p>Today</p>
        </div>

        <span className="checkin-live">LIVE</span>
      </div>

      <div className="checkin-chart">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart data={data}>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
            />

            <Tooltip />

            <Bar
              dataKey="checkins"
              fill="#7C3AED"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="checkin-summary">
        <div>
          <span>PEAK/HR</span>
          <strong>{peakPerHour}</strong>
        </div>

        <div>
          <span>AVG/HR</span>
          <strong>{averagePerHour}</strong>
        </div>

        <div>
          <span>TODAY</span>
          <strong>{totalToday}</strong>
        </div>
      </div>
    </div>
  );
}

export default CheckinActivity;