import { useEffect, useState } from "react";
import { Search, Download } from "lucide-react";

import { supabase } from "../lib/supabaseClient";
import { apiFetch } from "../lib/api";

import VIPInviteForm from "../components/UI/VIPInviteForm";
import ConfirmDialog from "../components/UI/ConfirmDialog";
import Toast from "../components/UI/Toast";
import QRViewerModal from "../components/UI/QRViewerModal";
import LoadingSpinner from "../components/shared/LoadingSpinner";

import "../styles/RegistrationsPage.css";



function RegistrationsPage() {
  const [activeTab, setActiveTab] = useState("registrations");
  const [attendees, setAttendees] = useState([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(true);

  const [vipInvitations, setVipInvitations] = useState([]);
  const [vipLoading, setVipLoading] = useState(true);
  const [checkInLogs, setCheckInLogs] = useState([]);

  const [checkInLoading, setCheckInLoading] = useState(true);
  const [attendeeSearch, setAttendeeSearch] = useState("");
  const [checkInSearch, setCheckInSearch] = useState("");

  const [showVIPForm, setShowVIPForm] = useState(false);
  const [vipToRevoke, setVipToRevoke] = useState(null);
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [toast, setToast] = useState(null);

    useEffect(() => {
  let isMounted = true;

  async function loadRegistrations() {
    try {
      setRegistrationsLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token;

      if (!token) {
        throw new Error("No active session was found.");
      }

      const [registrations, profiles] = await Promise.all([
        apiFetch("/api/registrations", {}, token),
        apiFetch("/api/profiles", {}, token),
      ]);

      const profilesById = new Map(
        profiles.map((profile) => [profile.id, profile])
      );

      const formattedAttendees = registrations.map((registration) => {
        const profile = profilesById.get(registration.user_id);

        return {
          id: registration.id,
          userId: registration.user_id,
          conferenceId: registration.conference_id,
          name: profile?.full_name?.trim() || "Unnamed attendee",
          email: profile?.email || "No email",
          code: registration.registration_code || "—",
          checkedIn: Boolean(registration.checked_in),
          checkInTime: registration.checked_in_at
            ? new Date(registration.checked_in_at).toLocaleString()
            : "—",
          qrData: registration.qr_code_data,
        };
      });

      if (isMounted) {
        setAttendees(formattedAttendees);
      }
    } catch (error) {
      console.error("Failed to load registrations:", error);

      if (isMounted) {
        setAttendees([]);
        setToast({
          message: "Unable to load registrations.",
          type: "error",
        });
      }
    } finally {
      if (isMounted) {
        setRegistrationsLoading(false);
      }
    }
  }

  loadRegistrations();

  return () => {
    isMounted = false;
  };
}, []);

useEffect(() => {
  let isMounted = true;

  async function loadVIPInvitations() {
    try {
      setVipLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token;

      if (!token) {
        throw new Error("No active session was found.");
      }

      const invitations = await apiFetch(
        "/api/vip-invitations",
        {},
        token
      );

      const formattedInvitations = invitations.map((invitation) => ({
        id: invitation.id,
        name: invitation.invitee_name || "Unnamed invitee",
        email: invitation.email || "No email",
        expiry: invitation.expires_at
          ? new Date(invitation.expires_at).toLocaleDateString()
          : "—",
        status: invitation.is_used ? "Used" : "Active",
        invitationCode: invitation.invitation_code,
        usedAt: invitation.used_at,
        usedBy: invitation.used_by,
        conferenceId: invitation.conference_id,
      }));

      if (isMounted) {
        setVipInvitations(formattedInvitations);
      }
    } catch (error) {
      console.error("Failed to load VIP invitations:", error);

      if (isMounted) {
        setVipInvitations([]);
        setToast({
          message: "Unable to load VIP invitations.",
          type: "error",
        });
      }
    } finally {
      if (isMounted) {
        setVipLoading(false);
      }
    }
  }

  loadVIPInvitations();

  return () => {
    isMounted = false;
  };
}, []);
useEffect(() => {
  let isMounted = true;

  async function loadCheckInLogs() {
    try {
      setCheckInLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token;

      if (!token) {
        throw new Error("No active session was found.");
      }

      const logs = await apiFetch(
        "/api/checkin-logs",
        {},
        token
      );

      const formattedLogs = logs.map((log) => ({
        id: log.id,
        name:
          log.attendee_name ||
          log.full_name ||
          log.name ||
          "Unnamed attendee",
        code:
          log.registration_code ||
          log.code ||
          "—",
        date: log.checked_in_at
          ? new Date(log.checked_in_at).toLocaleDateString()
          : "—",
        time: log.checked_in_at
          ? new Date(log.checked_in_at).toLocaleTimeString()
          : "—",
        location: log.location || "—",
        method: log.method || "—",
      }));

      if (isMounted) {
        setCheckInLogs(formattedLogs);
      }
    } catch (error) {
      console.error("Failed to load check-in logs:", error);

      if (isMounted) {
        setCheckInLogs([]);
        setToast({
          message: "Unable to load check-in logs.",
          type: "error",
        });
      }
    } finally {
      if (isMounted) {
        setCheckInLoading(false);
      }
    }
  }

  loadCheckInLogs();

  return () => {
    isMounted = false;
  };
}, []);


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

  async function handleVIPSubmit(formData) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const token = session?.access_token;

    if (!token) {
      throw new Error("No active session was found.");
    }

    const conferenceId =
      attendees[0]?.conferenceId ||
      vipInvitations[0]?.conferenceId;

    if (!conferenceId) {
      throw new Error(
        "Conference ID could not be determined."
      );
    }

    const invitationCode = crypto
      .randomUUID()
      .replaceAll("-", "")
      .slice(0, 10)
      .toUpperCase();

    const createdInvitation = await apiFetch(
      "/api/vip-invitations",
      {
        method: "POST",
        body: JSON.stringify({
          conference_id: conferenceId,
          email: formData.email.trim(),
          invitation_code: invitationCode,
          invitee_name: formData.name.trim(),
          expires_at: formData.expiryDate.toISOString(),
        }),
      },
      token
    );

    const formattedInvitation = {
      id: createdInvitation.id,
      name:
        createdInvitation.invitee_name ||
        "Unnamed invitee",
      email:
        createdInvitation.email ||
        "No email",
      expiry: createdInvitation.expires_at
        ? new Date(
            createdInvitation.expires_at
          ).toLocaleDateString()
        : "—",
      status: createdInvitation.is_used
        ? "Used"
        : "Active",
      invitationCode:
        createdInvitation.invitation_code,
      usedAt: createdInvitation.used_at,
      usedBy: createdInvitation.used_by,
      conferenceId:
        createdInvitation.conference_id,
    };

    setVipInvitations((previous) => [
      formattedInvitation,
      ...previous,
    ]);

    setShowVIPForm(false);

    try {
      await apiFetch(
        `/api/vip-invitations/${createdInvitation.id}/send`,
        { method: "POST" },
        token
      );
      showSuccessToast(
        "VIP invitation created and emailed successfully."
      );
    } catch (sendError) {
      console.error(
        "Failed to send VIP invitation email:",
        sendError
      );
      setToast({
        message:
          "Invitation created, but the email failed to send.",
        type: "error",
      });
    }
  } catch (error) {
    console.error(
      "Failed to create VIP invitation:",
      error
    );

    setToast({
      message:
        error.message ||
        "Unable to create VIP invitation.",
      type: "error",
    });
  }
}

async function handleResendInvite(invitee) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const token = session?.access_token;

    if (!token) {
      throw new Error("No active session was found.");
    }

    await apiFetch(
      `/api/vip-invitations/${invitee.id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          expires_at: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
        }),
      },
      token
    );

    await apiFetch(
      `/api/vip-invitations/${invitee.id}/send`,
      { method: "POST" },
      token
    );

    const newExpiry = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    setVipInvitations((previous) =>
      previous.map((invitation) =>
        invitation.id === invitee.id
          ? {
              ...invitation,
              expiry:
                newExpiry.toLocaleDateString(),
            }
          : invitation
      )
    );

    showSuccessToast(
      "Invitation extended and resent successfully."
    );
  } catch (error) {
    console.error(
      "Failed to resend invitation:",
      error
    );

    setToast({
      message:
        "Unable to resend the invitation.",
      type: "error",
    });
  }
}

async function handleRevokeInvite() {
  if (!vipToRevoke) return;

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const token = session?.access_token;

    if (!token) {
      throw new Error("No active session was found.");
    }

    await apiFetch(
      `/api/vip-invitations/${vipToRevoke.id}`,
      {
        method: "DELETE",
      },
      token
    );

    setVipInvitations((previous) =>
      previous.filter(
        (invitation) =>
          invitation.id !== vipToRevoke.id
      )
    );

    setVipToRevoke(null);

    showSuccessToast(
      "Invitation revoked successfully."
    );
  } catch (error) {
    console.error(
      "Failed to revoke invitation:",
      error
    );

    setToast({
      message:
        "Unable to revoke the invitation.",
      type: "error",
    });
  }
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

            {registrationsLoading ? (
  <LoadingSpinner text="Loading registrations..." />
) : filteredAttendees.length > 0 ? (
  filteredAttendees.map((attendee) => (
    <div
      className="registration-table-row"
      key={attendee.id}
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

      <button
        className="view-qr-button"
        onClick={() => setSelectedAttendee(attendee)}
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

            {vipLoading ? (
  <LoadingSpinner text="Loading VIP invitations..." />
) : vipInvitations.length > 0 ? (
  vipInvitations.map((invitee) => (
    <div
      className="registration-table-row"
      key={invitee.id}
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
          onClick={() => handleResendInvite(invitee)}
        >
          Resend
        </button>

        <button
          className="vip-revoke-button"
          onClick={() => setVipToRevoke(invitee)}
          disabled={invitee.status !== "Active"}
        >
          Revoke
        </button>
      </div>
    </div>
  ))
) : (
  <div className="registrations-empty-state">
    No VIP invitations found.
  </div>
)}
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

            {checkInLoading ? (
           <LoadingSpinner text="Loading check-in logs..." />
          ) : filteredCheckInLogs.length > 0 ? (
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