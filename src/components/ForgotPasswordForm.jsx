import { useState } from 'react'
import AuthLayout from './AuthLayout.jsx'

export default function ForgotPasswordForm({ onReset, onSwitch }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setBusy(true)
    const result = await onReset(email, password)
    setBusy(false)
    if (result.ok) {
      setSuccess(result.message)
      setPassword('')
      setConfirm('')
    } else {
      setError(result.message)
    }
  }

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Demo only: enter your registered email and choose a new password. No email is sent."
      footer={
        <button type="button" className="link-btn" onClick={() => onSwitch('login')}>
          Back to log in
        </button>
      }
    >
      <form onSubmit={handleSubmit} className="form" noValidate>
        <label>
          Registered email
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
          New password
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
          Confirm new password
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat new password"
            autoComplete="new-password"
            required
          />
        </label>
        {error && <p className="alert error" role="alert">{error}</p>}
        {success && <p className="alert success" role="status">{success}</p>}
        <button type="submit" className="btn primary" disabled={busy}>
          {busy ? 'Saving...' : 'Reset password'}
        </button>
      </form>
    </AuthLayout>
  )
}
