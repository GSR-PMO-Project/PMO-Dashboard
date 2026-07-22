import { useState } from "react";
import { Search, Download } from "lucide-react";
import "../styles/RegistrationsPage.css";

const attendees = [
  {
    name: "Ahmad Al-Faraj",
    email: "ahmad.f@example.com",
    code: "GSR-88213",
    checkedIn: true,
    checkInTime: "Oct 26, 11:41 AM",
  },
  {
    name: "Lama Al-Otaibi",
    email: "lama.o@example.com",
    code: "GSR-88214",
    checkedIn: true,
    checkInTime: "Oct 26, 11:52 AM",
  },
  {
    name: "Yazan Khoury",
    email: "yazan.k@example.com",
    code: "GSR-88215",
    checkedIn: false,
    checkInTime: "—",
  },
  {
    name: "Reem Al-Shammari",
    email: "reem.s@example.com",
    code: "GSR-88216",
    checkedIn: true,
    checkInTime: "Oct 26, 12:03 PM",
  },
  {
    name: "Hassan Al-Balawi",
    email: "hassan.b@example.com",
    code: "GSR-88217",
    checkedIn: false,
    checkInTime: "—",
  },
];

function RegistrationsPage() {
  const [activeTab, setActiveTab] = useState("registrations");

  return (
    <div className="registrations-page">
      <div className="registrations-tabs">
        <button
          className={`registrations-tab ${
            activeTab === "registrations" ? "active" : ""
          }`}
          onClick={() => setActiveTab("registrations")}
        >
          Registrations
        </button>

        <button
          className={`registrations-tab ${
            activeTab === "vip" ? "active" : ""
          }`}
          onClick={() => setActiveTab("vip")}
        >
          VIP Invitations
        </button>

        <button
          className={`registrations-tab ${
            activeTab === "checkin" ? "active" : ""
          }`}
          onClick={() => setActiveTab("checkin")}
        >
          Check-in Logs
        </button>
      </div>

      {activeTab === "registrations" && (
        <div className="registrations-card">
          <div className="registrations-card-header">
            <div className="registrations-title">
              <h3>Attendee Registrations</h3>
              <span className="registrations-count">
                {attendees.length}
              </span>
            </div>

            <div className="registrations-toolbar-actions">
              <div className="registrations-search">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search attendees..."
                />
              </div>

              <button className="export-button">
                <Download size={15} />
                Export
              </button>
            </div>
          </div>

          <div className="registrations-table">
            <div className="registration-table-row registration-table-head">
              <span>ATTENDEE</span>
              <span>CODE</span>
              <span>CHECKED IN</span>
              <span>CHECK-IN TIME</span>
              <span>ACTIONS</span>
            </div>

            {attendees.map((attendee) => (
              <div
                className="registration-table-row"
                key={attendee.code}
              >
                <div className="attendee-info">
                  <strong>{attendee.name}</strong>
                  <span>{attendee.email}</span>
                </div>

                <span>{attendee.code}</span>

                <span
                  className={`checkin-status ${
                    attendee.checkedIn
                      ? "checked-in"
                      : "not-checked-in"
                  }`}
                >
                  {attendee.checkedIn ? "Checked In" : "Not Yet"}
                </span>

                <span>{attendee.checkInTime}</span>

                <button className="view-qr-button">
                  View QR
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "vip" && (
        <div className="registrations-card">
          <div className="registrations-card-header">
            <h3>VIP Invitations</h3>
          </div>
        </div>
      )}

      {activeTab === "checkin" && (
        <div className="registrations-card">
          <div className="registrations-card-header">
            <h3>Check-in Logs</h3>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegistrationsPage;