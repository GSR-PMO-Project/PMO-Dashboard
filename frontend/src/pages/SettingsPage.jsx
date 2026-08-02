import { useState } from "react";
import { Zap, ExternalLink } from "lucide-react";
import "../styles/SettingsPage.css";
import Toast from "../components/UI/Toast";

const generalFields = [
  { label: "App Name", value: "GSR Conference App" },
  { label: "Organization", value: "Global Students Research Conference" },
  { label: "Default Language", value: "Arabic / English" },
  { label: "Timezone", value: "Asia/Riyadh (UTC+3)" },
];

const securityToggles = [
  { key: "mfa", label: "MFA Enforcement", subtitle: "Required", defaultOn: true },
  { key: "sessionTimeout", label: "Session Timeout", subtitle: "30 min", defaultOn: false },
  { key: "ipAllowlist", label: "IP Allowlist", subtitle: "Disabled", defaultOn: false },
  { key: "auditRetention", label: "Audit Retention", subtitle: "365 days", defaultOn: true },
];

function SettingsPage() {
  const [toggles, setToggles] = useState(
    Object.fromEntries(securityToggles.map((t) => [t.key, t.defaultOn]))
  );
  const [testStatus, setTestStatus] = useState(null); // null | "checking" | "ok" | "fail"
  const [toast, setToast] = useState(null);

  const handleToggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTestConnection = async () => {
      setTestStatus("checking");

      for (let attempt = 1; attempt <= 5; attempt++) {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL.replace("/api", "")}/health`
          );
          const data = await res.json();

          if (data.ok) {
            setTestStatus("ok");
            setToast({ message: "Backend connected successfully", type: "success" });
            return;
          }
        } catch (error) {
          console.log(`Attempt ${attempt} failed`, error);
        }
      }

      setTestStatus("fail");
      setToast({ message: "Unable to connect to the backend, please try again", type: "error" });
    };

  return (
    <div className="settings-page">

      <div className="settings-grid">
        <div className="card">
          <h3>General</h3>

          <div className="settings-list">
            {generalFields.map((field) => (
              <div className="settings-row" key={field.label}>
                <span className="settings-label">{field.label}</span>
                <div className="settings-value">
                  <span>{field.value}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

        <div className="card">
          <h3>Security</h3>
          <div className="settings-list">
            {securityToggles.map((t) => (
              <div className="settings-row" key={t.key}>
                <div>
                  <div className="settings-label">{t.label}</div>
                  <div className="settings-subtitle">{t.subtitle}</div>
                </div>
                <button
                  className={`toggle ${toggles[t.key] ? "on" : ""}`}
                  onClick={() => handleToggle(t.key)}
                >
                  <span className="toggle-knob" />
                </button>
              </div>
            ))}
          </div>

        </div>
        </div>

      <div className="card supabase-card">
        <div className="supabase-header">
          <h3>
            <Zap size={16} className="supabase-icon" /> Supabase Backend
          </h3>
          <span
            className={`badge ${
              testStatus === "ok"
                ? "badge-success"
                : testStatus === "fail"
                ? "badge-danger"
                : testStatus === "checking"
                ? "badge-warning"
                : "badge-neutral"
            }`}
          >
            {testStatus === "ok"
              ? "● Connected"
              : testStatus === "fail"
              ? "● Disconnected"
              : testStatus === "checking"
              ? "● Checking..."
              : "● Unknown"}
          </span>

        </div>

        <div className="supabase-grid">
          <div className="supabase-field">
            <span className="field-label">PROJECT URL</span>
            <span className="field-value">
              {import.meta.env.VITE_SUPABASE_URL || "https://xxxx.supabase.co"}
            </span>
          </div>
          <div className="supabase-field">
            <span className="field-label">ANON KEY</span>
            <span className="field-value">
              {(import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJh").slice(0, 4)}
              {"•".repeat(16)}
            </span>
          </div>
          <div className="supabase-field">
            <span className="field-label">DATABASE</span>
            <span className="field-value">PostgreSQL 15</span>
          </div>
          <div className="supabase-field">
            <span className="field-label">REALTIME</span>
            <span className="field-value">Enabled — WebSocket</span>
          </div>
        </div>

        <div className="supabase-actions">
          <button className="btn-test" onClick={handleTestConnection}>
            {testStatus === "checking" ? "Testing..." : "Test Connection"}
          </button>

        <a className="btn-view-dashboard"
          href="https://supabase.com/dashboard"
          target="_blank"
          rel="noreferrer"
        >
        View Supabase Dashboard <ExternalLink size={13} />
        </a>

          {testStatus === "ok" && <span className="test-result ok">✓ Backend reachable</span>}
          {testStatus === "fail" && <span className="test-result fail">Unable to connect to the backend.
                                                                       Please try again later.</span>}
        </div>
      </div>



  {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    );
  }
export default SettingsPage;