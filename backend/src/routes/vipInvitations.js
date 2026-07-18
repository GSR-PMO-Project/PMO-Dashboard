import { supabaseAdmin } from "../config/supabaseAdmin.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { crudRouter } from "../utils/crudRouter.js";

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
      email,
      code,
      conference_id,
    });
    if (error) throw error;
    res.json(data);
  })
);

vipInvitationsRouter.post(
  "/redeem",
  asyncHandler(async (req, res) => {
    const { user_id, code } = req.body;
    const { data, error } = await supabaseAdmin.rpc("redeem_vip_invitation", { user_id, code });
    if (error) throw error;
    res.json(data);
  })
);
