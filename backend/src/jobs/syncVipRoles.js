import { supabaseAdmin } from "../config/supabaseAdmin.js";

const INTERVAL_MS = 2 * 60 * 1000;

export async function syncVipRoles() {
  const { data: invitations, error: invitationsError } = await supabaseAdmin
    .from("vip_guest_invitations")
    .select("email");
  if (invitationsError) {
    console.error("VIP role sync: failed to load invitations:", invitationsError);
    return;
  }

  const invitedEmails = new Set(invitations.map((invitation) => invitation.email.toLowerCase()));
  if (invitedEmails.size === 0) return;

  const { data: attendees, error: attendeesError } = await supabaseAdmin
    .from("profiles")
    .select("id, email")
    .eq("role", "attendee");
  if (attendeesError) {
    console.error("VIP role sync: failed to load attendees:", attendeesError);
    return;
  }

  const matches = attendees.filter((profile) => profile.email && invitedEmails.has(profile.email.toLowerCase()));

  for (const match of matches) {
    const { error } = await supabaseAdmin.from("profiles").update({ role: "vip" }).eq("id", match.id);
    if (error) {
      console.error(`VIP role sync: failed to upgrade profile ${match.id}:`, error);
    } else {
      console.log(`VIP role sync: upgraded ${match.email} to vip`);
    }
  }
}

export function startVipRoleSyncJob() {
  syncVipRoles();
  setInterval(syncVipRoles, INTERVAL_MS);
}
