import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from "react-router-dom";
import '../styles/LoginPage.css'

export default function LoginPage() {
  const { signIn , session } = useAuth()
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
      if (session) {
        navigate("/", { replace: true });
      }
    }, [session, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Email and password are required')
      return
    }

    setLoading(true)
    const { error: signInError } = await signIn(email, password)
    setLoading(false)

    if (signInError) {
      setError('Invalid login credentials')
    } else {
           navigate("/", { replace: true });
         }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Sign In</h1>
        <p className="subtitle">GSR Admin Dashboard</p>

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
        />

        <label>Password</label>
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

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="login-submit-button" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}