import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "../../styles/CheckinActivity.css";

const data = [
  { time: "08h", checkins: 28 },
  { time: "09h", checkins: 48 },
  { time: "10h", checkins: 75 },
  { time: "11h", checkins: 66 },
  { time: "12h", checkins: 84 },
  { time: "13h", checkins: 72 },
  { time: "14h", checkins: 92 },
  { time: "15h", checkins: 80 },
  { time: "16h", checkins: 64 },
];

function CheckinActivity() {
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
        <ResponsiveContainer width="100%" height="100%">
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
    <strong>142</strong>
  </div>

  <div>
    <span>AVG/HR</span>
    <strong>89</strong>
  </div>

  <div>
    <span>NOW</span>
    <strong>312</strong>
  </div>
</div>
    </div>
  );
}

export default CheckinActivity;