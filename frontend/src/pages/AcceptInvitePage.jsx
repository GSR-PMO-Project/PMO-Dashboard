import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../hooks/useAuth";
import "../styles/LoginPage.css";

export default function AcceptInvitePage() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSaving(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (updateError) {
      setError(updateError.message);
    } else {
      navigate("/", { replace: true });
    }
  };

  if (loading) return null;

  // The invite email link carries a token that supabase-js exchanges for a session
  // on page load. No session here means the link is invalid, already used, or expired.
  if (!session) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1>Invite link expired</h1>
          <p className="subtitle">
            This invitation link is invalid or has expired. Ask an admin to resend it.
          </p>
          <button className="login-submit-button" onClick={() => navigate("/login")}>
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Set your password</h1>
        <p className="subtitle">Welcome — choose a password to finish setting up your account.</p>

        <label>New Password</label>
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((show) => !show)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <label>Confirm Password</label>
        <input
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
        />

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="login-submit-button" disabled={saving}>
          {saving ? "Saving..." : "Set Password & Continue"}
        </button>
      </form>
    </div>
  );
}
