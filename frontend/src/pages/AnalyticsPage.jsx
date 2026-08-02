import { useState } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import "../styles/AnalyticsPage.css";
import { useAnalytics } from "../hooks/useAnalytics";
import Table from "../components/shared/Table";
import Tabs from "../components/shared/Tabs";
import LoadingSpinner from "../components/shared/LoadingSpinner";

const ranges = ["Last 24h", "Day 1", "Day 2", "Day 3"];
const tabs = [
  { key: "overview", label: "Overview" },
  { key: "sessionFeedback", label: "Session Feedback" },
  { key: "conferenceFeedback", label: "Conference Feedback" },
];

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

  const {
    loading,
    error,
    registrationData,
    kpis,
    sessionFeedback,
    conferenceFeedback,
    conferenceNameById,
  } = useAnalytics(activeRange);

  const handleExportCSV = () => {
    exportToCSV(registrationData, "registration-volume.csv");
  };

  const handleExportPDF = () => {
    // P2 per sprint plan — intentionally deferred
    alert("PDF export is a P2 (stretch) feature");
  };

  const sessionColumns = [
    {
      key: "session_id",
      label: "Session",
    },
    {
      key: "speaker",
      label: "Speaker Rating",
      render: (f) => "★".repeat(f.speaker_communication_rating || 0),
    },
    {
      key: "efficiency",
      label: "Efficiency Rating",
      render: (f) => "★".repeat(f.session_efficiency_rating || 0),
    },
    {
      key: "overall_rating",
      label: "Overall",
    },
    {
      key: "comments",
      label: "Comments",
      className: "muted-text",
      render: (f) => f.additional_comments || "—",
    },
  ];

  const conferenceColumns = [
    {
      key: "conference",
      label: "Conference",
      render: (f) =>
        conferenceNameById[f.conference_id] || f.conference_id,
    },
    {
      key: "rating",
      label: "Rating",
      render: (f) =>
        "★".repeat(Math.round(f.avg_overall_rating) || 0),
    },
    {
      key: "feedback_count",
      label: "Feedback Count",
    },
    {
      key: "comments",
      label: "Comments",
      className: "muted-text",
      render: (f) => f.additional_comments || "—",
    },
  ];

  return (
    <div className="analytics-page">
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {loading && <LoadingSpinner />}
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
          <Table
            columns={sessionColumns}
            rows={sessionFeedback}
            emptyMessage="No session feedback yet."
          />
          </div>
          )}

      {!loading && !error && activeTab === "conferenceFeedback" && (
        <div className="card">
          <h3>Conference Feedback</h3>
          <Table
            columns={conferenceColumns}
            rows={conferenceFeedback}
            emptyMessage="No conference feedback yet."
          />

        </div>
      )}
    </div>
  );
}

export default AnalyticsPage;