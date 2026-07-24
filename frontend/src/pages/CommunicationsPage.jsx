import { useState } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
// import { api } from "../lib/api"; // TODO: uncomment when connecting to real backend

import "../styles/AnalyticsPage.css";

const registrationData = [
  { time: "08h", value: 12 },
  { time: "09h", value: 22 },
  { time: "10h", value: 48 },
  { time: "11h", value: 38 },
  { time: "12h", value: 55 },
  { time: "13h", value: 44 },
  { time: "14h", value: 62 },
  { time: "15h", value: 50 },
  { time: "16h", value: 30 },
];
// TODO(API): replace registrationData with GET /views/registration-volume?range=...

const kpis = [
  { label: "Avg. Session Rating", value: "4.3 / 5", variant: "success" },
  { label: "Avg. Conference Rating", value: "4.7 / 5", variant: "success" },
  { label: "Check-in Rate", value: "68%", variant: "purple" },
  { label: "Waitlist Promotions", value: "12", variant: "purple" },
  { label: "VIP Redemption Rate", value: "50%", variant: "warn" },
];
// TODO(API): replace kpis with real aggregates from
// session_feedback_summary / conference_feedback_summary / checkin_logs

const sessionFeedback = [
  { session: "Keynote: Future of AI", speakerRating: 5, efficiencyRating: 4, overall: 4.5, comments: "Great opener" },
  { session: "Hands-on ML Workshop", speakerRating: 4, efficiencyRating: 4, overall: 4.0, comments: "Loved the pace" },
];
// TODO(API): replace with GET /views/session-feedback-summary

const conferenceFeedback = [
  { conference: "GSR Conference 2026", rating: 5, comments: "Best one yet" },
  { conference: "GSR Regional Meetup — Riyadh", rating: 4, comments: "Good venue" },
];
// TODO(API): replace with GET /views/conference-feedback-summary

const ranges = ["Last 24h", "Day 1", "Day 2", "Day 3"];
const tabs = [
  { key: "overview", label: "Overview" },
  { key: "sessionFeedback", label: "Session Feedback" },
  { key: "conferenceFeedback", label: "Conference Feedback" },
];

function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeRange, setActiveRange] = useState("Last 24h");

  const handleExportCSV = () => {
    // TODO(API): trigger real CSV export/download
    alert("CSV export coming soon");
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

      {activeTab === "overview" && (
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

              <div className="registration-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={registrationData}>
                    <XAxis dataKey="time" axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#7C3AED" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
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

      {activeTab === "sessionFeedback" && (
        <div className="card">
          <h3>Session Feedback</h3>
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
                <tr key={f.session}>
                  <td>{f.session}</td>
                  <td>{"★".repeat(f.speakerRating)}</td>
                  <td>{"★".repeat(f.efficiencyRating)}</td>
                  <td>{f.overall}</td>
                  <td className="muted-text">{f.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "conferenceFeedback" && (
        <div className="card">
          <h3>Conference Feedback</h3>
          <table className="feedback-table">
            <thead>
              <tr>
                <th>Conference</th>
                <th>Rating</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {conferenceFeedback.map((f) => (
                <tr key={f.conference}>
                  <td>{f.conference}</td>
                  <td>{"★".repeat(f.rating)}</td>
                  <td className="muted-text">{f.comments}</td>
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