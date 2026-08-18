import { supabaseAdmin } from "../config/supabaseAdmin.js";
import { env } from "../config/env.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { crudRouter } from "../utils/crudRouter.js";
import { sendUserInvitationEmail } from "../utils/mailer.js";

// profiles are auto-created by a trigger on signup - no raw POST/DELETE here, admins can
// only look them up and change their role (e.g. attendee -> organizer). New admin/staff
// accounts go through /invite below, which creates the auth user (triggering that same
// profile row) and emails them a link to set their password via Resend. We can't reuse
// Supabase's built-in "Invite user" email for this - that template is already used by
// the mobile app for a different (OTP code) flow.
export const profilesRouter = crudRouter({
  table: "profiles",
  createFields: [],
  updateFields: ["role", "full_name"],
  filterFields: ["role"],
  defaultOrder: { column: "created_at", ascending: false },
});

const INVITABLE_ROLES = new Set(["admin", "organizer"]);

profilesRouter.post(
  "/invite",
  asyncHandler(async (req, res) => {
    const { email, full_name, role } = req.body;

    if (!email?.trim() || !full_name?.trim()) {
      return res.status(400).json({ error: "email and full_name are required" });
    }
    if (!INVITABLE_ROLES.has(role)) {
      return res.status(400).json({ error: "role must be admin or organizer" });
    }

    // generateLink (vs. inviteUserByEmail) creates the auth user but does not send
    // Supabase's own email - it just hands back the action link, which we email
    // ourselves via Resend below.
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "invite",
      email,
      options: {
        data: { full_name },
        redirectTo: `${env.frontendOrigin}/accept-invite`,
      },
    });
    if (error) throw error;

    // Upsert, not update: the profiles-on-signup trigger may not have inserted a row
    // yet (e.g. if it only fires for confirmed accounts), so we can't assume one exists.
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert({ id: data.user.id, email, full_name, role }, { onConflict: "id" })
      .select()
      .single();
    if (profileError) throw profileError;

    await sendUserInvitationEmail({
      email,
      full_name,
      role,
      actionLink: data.properties.action_link,
    });

    res.status(201).json(profile);
  })
);

profilesRouter.post(
  "/:id/revoke",
  asyncHandler(async (req, res) => {
    // Deletes the Supabase Auth user, not just the profiles row - profiles.id
    // references auth.users(id) on delete cascade, so this takes the profile with
    // it. Deleting only the profile would leave an orphaned auth account that could
    // still sign in.
    const { error } = await supabaseAdmin.auth.admin.deleteUser(req.params.id);
    if (error) throw error;
    res.status(204).end();
  })
);
