import { useState } from 'react'
import AuthLayout from './AuthLayout.jsx'

export default function SignupForm({ onSignup, onSwitch }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setBusy(true)
    const result = await onSignup(name, email, password)
    setBusy(false)
    if (!result.ok) setError(result.message)
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Sign up to start organising your study tasks."
      footer={
        <>
          Already registered?{' '}
          <button type="button" className="link-btn" onClick={() => onSwitch('login')}>
            Log in
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="form" noValidate>
        <label>
          Full name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            required
          />
        </label>
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
            placeholder="At least 6 characters"
            autoComplete="new-password"
            required
          />
        </label>
        <label>
          Confirm password
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat password"
            autoComplete="new-password"
            required
          />
        </label>
        {error && <p className="alert error" role="alert">{error}</p>}
        <button type="submit" className="btn primary" disabled={busy}>
          {busy ? 'Creating...' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  )
}
