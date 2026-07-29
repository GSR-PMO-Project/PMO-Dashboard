import { useState , useEffect} from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { api } from "../lib/api";
import "../styles/AnalyticsPage.css";

const ranges = ["Last 24h", "Day 1", "Day 2", "Day 3"];
const tabs = [
  { key: "overview", label: "Overview" },
  { key: "sessionFeedback", label: "Session Feedback" },
  { key: "conferenceFeedback", label: "Conference Feedback" },
];

function groupRegistrationsByHour(registrations) {
  const counts = {};
  registrations.forEach((r) => {
    const hour = new Date(r.created_at).getHours();
    const label = `${String(hour).padStart(2, "0")}h`;
    counts[label] = (counts[label] || 0) + 1;
  });

  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([time, value]) => ({ time, value }));
}


function filterRegistrationsByRange(registrations, range, activeConference) {
  if (range === "Last 24h") {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    return registrations.filter(
      (r) => new Date(r.created_at).getTime() >= cutoff
    );
  }

  if (!activeConference) return registrations;

  const dayOffset = { "Day 1": 0, "Day 2": 1, "Day 3": 2 }[range] ?? 0;
  const start = new Date(activeConference.start_date);
  start.setDate(start.getDate() + dayOffset);
  const targetDay = start.toISOString().slice(0, 10);

  return registrations.filter(
    (r) => r.created_at?.slice(0, 10) === targetDay
  );
}

function average(nums) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}
function exportToCSV(rows, filename) {
  if (!rows.length) return;

  const headers = Object.keys(rows[0]);
  const csvLines = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`)
        .join(",")
    ),
  ];

  const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeRange, setActiveRange] = useState("Last 24h");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [registrationData, setRegistrationData] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [sessionFeedback, setSessionFeedback] = useState([]);
  const [conferenceFeedback, setConferenceFeedback] = useState([]);
  const [conferenceNameById, setConferenceNameById] = useState({});
  const [rawRegistrations, setRawRegistrations] = useState([]);
  const [conferencesList, setConferencesList] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError("");

    Promise.all([
      api.get("/registrations"),
      api.get("/vip-invitations"),
      api.get("/views/session-feedback-summary"),
      api.get("/views/conference-feedback-summary"),
      api.get("/conferences"),
    ])
    .then(([registrations, vipInvitations, sessionFb, conferenceFb, conferences])  => {
        setConferenceNameById(
          Object.fromEntries(conferences.map((c) => [c.id, c.name]))
        );
    setRawRegistrations(registrations);



        const checkedIn = registrations.filter((r) => r.checked_in).length;
        const checkinRate = registrations.length
          ? Math.round((checkedIn / registrations.length) * 100)
          : 0;

        const redeemed = vipInvitations.filter((v) => v.is_used).length;
        const vipRate = vipInvitations.length
          ? Math.round((redeemed / vipInvitations.length) * 100)
          : 0;

        const avgSessionRating = average(
          sessionFb.map((s) => s.overall_rating).filter((n) => n != null)
        );
        const avgConferenceRating = average(
          conferenceFb.map((c) => c.overall_rating).filter((n) => n != null)
        );

        setKpis([
          { label: "Avg. Session Rating", value: `${avgSessionRating.toFixed(1)} / 5`, variant: "success" },
          { label: "Avg. Conference Rating", value: `${avgConferenceRating.toFixed(1)} / 5`, variant: "success" },
          { label: "Check-in Rate", value: `${checkinRate}%`, variant: "purple" },
          { label: "Waitlist Promotions", value: "—", variant: "purple" },
          { label: "VIP Redemption Rate", value: `${vipRate}%`, variant: "warn" },
        ]);

        setSessionFeedback(sessionFb);
        setConferenceFeedback(conferenceFb);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (rawRegistrations.length === 0) return;

    const activeConference = conferencesList.find((c) => c.is_active) || conferencesList[0];
    const filtered = filterRegistrationsByRange(
      rawRegistrations,
      activeRange,
      activeConference
    );

    setRegistrationData(groupRegistrationsByHour(filtered));
  }, [rawRegistrations, activeRange, conferencesList]);

  const handleExportCSV = () => {
    exportToCSV(registrationData, "registration-volume.csv");
  };

  const handleExportPDF = () => {
    // P2 per sprint plan — intentionally deferred
    alert("PDF export is a P2 (stretch) feature");
  };

  return (
    <div className="analytics-page">
      <div className="analytics-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`analytics-tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {loading && <p className="muted-text">Loading analytics...</p>}
      {!loading && error && <p className="error-text">{error}</p>}

      {!loading && !error && activeTab === "overview" && (
        <>
          <div className="analytics-toolbar">
            <div className="range-pills">
              {ranges.map((r) => (
                <button
                  key={r}
                  className={`range-pill ${activeRange === r ? "active" : ""}`}
                  onClick={() => setActiveRange(r)}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="export-actions">
              <button className="btn-csv" onClick={handleExportCSV}>
                ↓ CSV
              </button>
              <button className="btn-pdf" onClick={handleExportPDF}>
                ↓ PDF Report
              </button>
            </div>
          </div>

          <div className="analytics-grid">
            <div className="card registration-card">
              <div className="registration-header">
                <div className="registration-title">
                  <h3>Registration Volume</h3>
                  <span className="badge badge-purple">Hourly</span>
                </div>
                <span className="live-pill">● LIVE</span>
              </div>

              {registrationData.length === 0 ? (
                <p className="muted-text">No registrations yet.</p>
              ) : (
                <div className="registration-chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={registrationData}>
                    <XAxis dataKey="time" axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#7C3AED" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              )}
            </div>

            <div className="card kpi-card">
              <h3>Performance KPIs</h3>
              <div className="kpi-list">
                {kpis.map((kpi) => (
                  <div className="kpi-row" key={kpi.label}>
                    <span className="kpi-label">{kpi.label}</span>
                    <span className={`kpi-value kpi-${kpi.variant}`}>{kpi.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {!loading && !error && activeTab === "sessionFeedback" && (
        <div className="card">
          <h3>Session Feedback</h3>
          {sessionFeedback.length === 0 ? (
            <p className="muted-text">No session feedback yet.</p>
          ) : (
          <table className="feedback-table">
            <thead>
              <tr>
                <th>Session</th>
                <th>Speaker Rating</th>
                <th>Efficiency Rating</th>
                <th>Overall</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {sessionFeedback.map((f) => (
                <tr key={f.session_id}>
                  <td>{f.session_id}</td>
                  <td>{"★".repeat(f.speaker_communication_rating || 0)}</td>
                  <td>{"★".repeat(f.session_efficiency_rating || 0)}</td>
                  <td>{f.overall_rating}</td>
                  <td className="muted-text">{f.additional_comments || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      )}

      {!loading && !error && activeTab === "conferenceFeedback" && (
        <div className="card">
          <h3>Conference Feedback</h3>
          <table className="feedback-table">
            <thead>
              <tr>
                <th>Conference</th>
                <th>Rating</th>
                <th>Feedback Count</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {conferenceFeedback.map((f) => (
                <tr key={f.conference_id}>
                  <td>{conferenceNameById[f.conference_id] || f.conference_id}</td>
                  <td>{"★".repeat(Math.round(f.avg_overall_rating) || 0)}</td>
                  <td>{f.feedback_count}</td>
                  <td className="muted-text">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AnalyticsPage;