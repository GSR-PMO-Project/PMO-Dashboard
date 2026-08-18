import { supabaseAdmin } from "../config/supabaseAdmin.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { crudRouter } from "../utils/crudRouter.js";
import { sendVipInvitationEmail } from "../utils/mailer.js";

// is_used / used_at / used_by are managed by redeem_vip_invitation, not editable directly.
const createFields = ["conference_id", "email", "invitation_code", "invitee_name", "expires_at"];
const updateFields = ["email", "invitee_name", "expires_at"];

export const vipInvitationsRouter = crudRouter({
  table: "vip_guest_invitations",
  createFields,
  updateFields,
  filterFields: ["conference_id", "is_used"],
  defaultOrder: { column: "created_at", ascending: false },
});

vipInvitationsRouter.post(
  "/validate",
  asyncHandler(async (req, res) => {
    const { email, code, conference_id } = req.body;
    const { data, error } = await supabaseAdmin.rpc("validate_vip_invitation", {
      p_email: email,
      p_invitation_code: code,
      p_conference_id: conference_id,
    });
    if (error) throw error;
    res.json(data);
  })
);

vipInvitationsRouter.post(
  "/:id/send",
  asyncHandler(async (req, res) => {
    const { data: invitation, error } = await supabaseAdmin
      .from("vip_guest_invitations")
      .select("*")
      .eq("id", req.params.id)
      .single();
    if (error) throw error;

    let conferenceName;
    if (invitation.conference_id) {
      const { data: conference } = await supabaseAdmin
        .from("conferences")
        .select("name")
        .eq("id", invitation.conference_id)
        .single();
      conferenceName = conference?.name;
    }

    await sendVipInvitationEmail({ invitation, conferenceName });

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id, role")
      .eq("email", invitation.email)
      .maybeSingle();

    if (profile && profile.role === "attendee") {
      const { error: roleError } = await supabaseAdmin
        .from("profiles")
        .update({ role: "vip" })
        .eq("id", profile.id);
      if (roleError) throw roleError;
    }

    res.json({ sent: true });
  })
);

vipInvitationsRouter.post(
  "/redeem",
  asyncHandler(async (req, res) => {
    const { user_id, code } = req.body;
    const { data, error } = await supabaseAdmin.rpc("redeem_vip_invitation", {
      p_user_id: user_id,
      p_invitation_code: code,
    });
    if (error) throw error;
    res.json(data);
  })
);
