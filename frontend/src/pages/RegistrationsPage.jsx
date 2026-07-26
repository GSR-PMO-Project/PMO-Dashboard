import { useState } from "react";
import { Search, Download } from "lucide-react";

import VIPInviteForm from "../components/UI/VIPInviteForm";
import ConfirmDialog from "../components/UI/ConfirmDialog";
import Toast from "../components/UI/Toast";
import QRViewerModal from "../components/UI/QRViewerModal";

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

const vipInvitations = [
  {
    name: "Dr. Khalid Al-Harbi",
    email: "khalid.h@example.com",
    expiry: "Oct 25, 2026",
    status: "Active",
  },
  {
    name: "Sarah Mitchell",
    email: "sarah.m@example.com",
    expiry: "Oct 25, 2026",
    status: "Active",
  },
  {
    name: "Omar Al-Qahtani",
    email: "omar.q@example.com",
    expiry: "Oct 24, 2026",
    status: "Revoked",
  },
];

const checkInLogs = [
  {
    id: 1,
    name: "Ahmad Al-Faraj",
    code: "GSR-88213",
    date: "Oct 26, 2026",
    time: "11:41 AM",
    location: "Main Entrance",
    method: "QR Code",
  },
  {
    id: 2,
    name: "Lama Al-Otaibi",
    code: "GSR-88214",
    date: "Oct 26, 2026",
    time: "11:52 AM",
    location: "Main Entrance",
    method: "QR Code",
  },
  {
    id: 3,
    name: "Reem Al-Shammari",
    code: "GSR-88216",
    date: "Oct 26, 2026",
    time: "12:03 PM",
    location: "VIP Entrance",
    method: "Manual",
  },
];

function RegistrationsPage() {
  const [activeTab, setActiveTab] = useState("registrations");

  const [attendeeSearch, setAttendeeSearch] = useState("");
  const [checkInSearch, setCheckInSearch] = useState("");

  const [showVIPForm, setShowVIPForm] = useState(false);
  const [vipToRevoke, setVipToRevoke] = useState(null);
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [toast, setToast] = useState(null);

  const filteredAttendees = attendees.filter((attendee) => {
    const searchValue = attendeeSearch.toLowerCase();

    return (
      attendee.name.toLowerCase().includes(searchValue) ||
      attendee.email.toLowerCase().includes(searchValue) ||
      attendee.code.toLowerCase().includes(searchValue)
    );
  });

  const filteredCheckInLogs = checkInLogs.filter((log) => {
    const searchValue = checkInSearch.toLowerCase();

    return (
      log.name.toLowerCase().includes(searchValue) ||
      log.code.toLowerCase().includes(searchValue) ||
      log.location.toLowerCase().includes(searchValue) ||
      log.method.toLowerCase().includes(searchValue)
    );
  });

  function showSuccessToast(message) {
    setToast({
      message,
      type: "success",
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  }

  function handleVIPSubmit(formData) {
    console.log("New VIP Invitation:", formData);

    showSuccessToast("VIP invitation sent successfully.");
  }

  function handleResendInvite(invitee) {
    console.log("Resend invitation:", invitee);

    showSuccessToast("Invitation resent successfully.");
  }

  function handleRevokeInvite() {
    console.log("Revoke invitation:", vipToRevoke);

    setVipToRevoke(null);

    showSuccessToast("Invitation revoked successfully.");
  }

  function downloadCSV(filename, rows) {
    if (!rows.length) {
      return;
    }

    const headers = Object.keys(rows[0]);

    const csvRows = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((header) => {
            const value = String(row[header] ?? "");
            return `"${value.replaceAll('"', '""')}"`;
          })
          .join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");

    downloadLink.href = url;
    downloadLink.download = filename;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    URL.revokeObjectURL(url);
  }

  function handleExportRegistrations() {
    downloadCSV("attendee-registrations.csv", filteredAttendees);

    showSuccessToast("Registrations exported successfully.");
  }

  function handleExportCheckInLogs() {
    downloadCSV("check-in-logs.csv", filteredCheckInLogs);

    showSuccessToast("Check-in logs exported successfully.");
  }

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
                {filteredAttendees.length}
              </span>
            </div>

            <div className="registrations-toolbar-actions">
              <div className="registrations-search">
                <Search size={16} />

                <input
                  type="text"
                  value={attendeeSearch}
                  onChange={(event) =>
                    setAttendeeSearch(event.target.value)
                  }
                  placeholder="Search attendees..."
                />
              </div>

              <button
                className="export-button"
                onClick={handleExportRegistrations}
              >
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

            {filteredAttendees.length > 0 ? (
              filteredAttendees.map((attendee) => (
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
                    {attendee.checkedIn
                      ? "Checked In"
                      : "Not Yet"}
                  </span>

                  <span>{attendee.checkInTime}</span>

                  <button
                    className="view-qr-button"
                    onClick={() =>
                      setSelectedAttendee(attendee)
                    }
                  >
                    View QR
                  </button>
                </div>
              ))
            ) : (
              <div className="registrations-empty-state">
                No attendees found.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "vip" && (
        <div className="registrations-card">
          <div className="registrations-card-header">
            <div className="registrations-title">
              <h3>VIP Invitations</h3>

              <span className="registrations-count">
                {vipInvitations.length}
              </span>
            </div>

            <button
              className="primary-button"
              onClick={() => setShowVIPForm(true)}
            >
              New VIP Invite
            </button>
          </div>

          <div className="registrations-table">
            <div className="registration-table-row vip-table-head">
              <span>INVITEE</span>
              <span>EMAIL</span>
              <span>EXPIRY</span>
              <span>STATUS</span>
              <span>ACTIONS</span>
            </div>

            {vipInvitations.map((invitee) => (
              <div
                className="registration-table-row"
                key={invitee.email}
              >
                <strong>{invitee.name}</strong>

                <span>{invitee.email}</span>

                <span>{invitee.expiry}</span>

                <span
                  className={`checkin-status ${
                    invitee.status === "Active"
                      ? "checked-in"
                      : "not-checked-in"
                  }`}
                >
                  {invitee.status}
                </span>

                <div className="vip-actions">
                  <button
                    className="view-qr-button"
                    onClick={() =>
                      handleResendInvite(invitee)
                    }
                  >
                    Resend
                  </button>

                  <button
                    className="vip-revoke-button"
                    onClick={() =>
                      setVipToRevoke(invitee)
                    }
                    disabled={invitee.status === "Revoked"}
                  >
                    Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "checkin" && (
        <div className="registrations-card">
          <div className="registrations-card-header">
            <div className="registrations-title">
              <h3>Check-in Logs</h3>

              <span className="registrations-count">
                {filteredCheckInLogs.length}
              </span>
            </div>

            <div className="registrations-toolbar-actions">
              <div className="registrations-search">
                <Search size={16} />

                <input
                  type="text"
                  value={checkInSearch}
                  onChange={(event) =>
                    setCheckInSearch(event.target.value)
                  }
                  placeholder="Search check-in logs..."
                />
              </div>

              <button
                className="export-button"
                onClick={handleExportCheckInLogs}
              >
                <Download size={15} />
                Export
              </button>
            </div>
          </div>

          <div className="registrations-table">
            <div className="checkin-log-row checkin-log-head">
              <span>ATTENDEE</span>
              <span>CODE</span>
              <span>DATE</span>
              <span>TIME</span>
              <span>LOCATION</span>
              <span>METHOD</span>
            </div>

            {filteredCheckInLogs.length > 0 ? (
              filteredCheckInLogs.map((log) => (
                <div
                  className="checkin-log-row"
                  key={log.id}
                >
                  <strong>{log.name}</strong>
                  <span>{log.code}</span>
                  <span>{log.date}</span>
                  <span>{log.time}</span>
                  <span>{log.location}</span>

                  <span className="checkin-method">
                    {log.method}
                  </span>
                </div>
              ))
            ) : (
              <div className="registrations-empty-state">
                No check-in logs found.
              </div>
            )}
          </div>
        </div>
      )}

      {showVIPForm && (
        <VIPInviteForm
          onClose={() => setShowVIPForm(false)}
          onSubmit={handleVIPSubmit}
        />
      )}

      {vipToRevoke && (
        <ConfirmDialog
          title="Revoke Invitation?"
          message={`Are you sure you want to revoke the invitation for ${vipToRevoke.name}?`}
          confirmText="Revoke"
          onCancel={() => setVipToRevoke(null)}
          onConfirm={handleRevokeInvite}
        />
      )}

      {selectedAttendee && (
        <QRViewerModal
          attendee={selectedAttendee}
          onClose={() => setSelectedAttendee(null)}
        />
      )}

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

export default RegistrationsPage;