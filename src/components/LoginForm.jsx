import { useState } from 'react'
import AuthLayout from './AuthLayout.jsx'

export default function LoginForm({ onLogin, onSwitch }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    const result = await onLogin(email, password)
    setBusy(false)
    if (!result.ok) setError(result.message)
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to see your tasks."
      footer={
        <>
          New here?{' '}
          <button type="button" className="link-btn" onClick={() => onSwitch('signup')}>
            Create account
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="form" noValidate>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            autoComplete="current-password"
            required
          />
        </label>
        {error && <p className="alert error" role="alert">{error}</p>}
        <button type="submit" className="btn primary" disabled={busy}>
          {busy ? 'Logging in...' : 'Log in'}
        </button>
        <button type="button" className="link-btn" onClick={() => onSwitch('forgot')}>
          Forgot password?
        </button>
      </form>
    </AuthLayout>
  )
}
