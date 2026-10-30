import { useEffect, useMemo, useState } from 'react'
import LoginForm from './components/LoginForm.jsx'
import SignupForm from './components/SignupForm.jsx'
import ForgotPasswordForm from './components/ForgotPasswordForm.jsx'
import Dashboard from './components/Dashboard.jsx'
import {
  KEYS,
  readStorage,
  writeStorage,
  removeStorage,
  hashPassword,
  makeId,
} from './utils/storage.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function App() {
  const [users, setUsers] = useState(() => readStorage(KEYS.users, []))
  const [sessionEmail, setSessionEmail] = useState(() => readStorage(KEYS.session, null))
  const [tasks, setTasks] = useState(() => readStorage(KEYS.tasks, []))
  const [authView, setAuthView] = useState('login')

  useEffect(() => writeStorage(KEYS.users, users), [users])
  useEffect(() => writeStorage(KEYS.tasks, tasks), [tasks])
  useEffect(() => {
    if (sessionEmail) writeStorage(KEYS.session, sessionEmail)
    else removeStorage(KEYS.session)
  }, [sessionEmail])

  const currentUser = useMemo(
    () => users.find((u) => u.email === sessionEmail) || null,
    [users, sessionEmail],
  )

  const myTasks = useMemo(
    () => tasks.filter((t) => t.ownerEmail === sessionEmail),
    [tasks, sessionEmail],
  )

  // ---------- Auth ----------
  async function handleSignup(name, email, password) {
    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()

    if (!cleanName) return { ok: false, message: 'Please enter your name.' }
    if (!EMAIL_PATTERN.test(cleanEmail)) return { ok: false, message: 'Please enter a valid email.' }
    if (password.length < 6) return { ok: false, message: 'Password must be at least 6 characters.' }
    if (users.some((u) => u.email === cleanEmail)) {
      return { ok: false, message: 'An account with this email already exists.' }
    }

    const passwordHash = await hashPassword(password)
    setUsers((prev) => [...prev, { name: cleanName, email: cleanEmail, passwordHash }])
    setSessionEmail(cleanEmail)
    return { ok: true }
  }

  async function handleLogin(email, password) {
    const cleanEmail = email.trim().toLowerCase()
    const user = users.find((u) => u.email === cleanEmail)
    if (!user) return { ok: false, message: 'No account found for this email.' }

    const passwordHash = await hashPassword(password)
    if (user.passwordHash !== passwordHash) return { ok: false, message: 'Incorrect password.' }

    setSessionEmail(cleanEmail)
    return { ok: true }
  }

  async function handleReset(email, newPassword) {
    const cleanEmail = email.trim().toLowerCase()
    if (!users.some((u) => u.email === cleanEmail)) {
      return { ok: false, message: 'No account found for this email.' }
    }
    if (newPassword.length < 6) {
      return { ok: false, message: 'Password must be at least 6 characters.' }
    }

    const passwordHash = await hashPassword(newPassword)
    setUsers((prev) => prev.map((u) => (u.email === cleanEmail ? { ...u, passwordHash } : u)))
    return { ok: true, message: 'Password updated. You can now log in with the new password.' }
  }

  function handleLogout() {
    setSessionEmail(null)
    setAuthView('login')
  }

  // ---------- Tasks ----------
  function handleAddTask(data) {
    const task = {
      id: makeId(),
      ownerEmail: sessionEmail,
      completed: false,
      createdAt: new Date().toISOString(),
      ...data,
    }
    setTasks((prev) => [task, ...prev])
  }

  function handleToggleTask(id) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  function handleDeleteTask(id) {
    if (!window.confirm('Delete this task?')) return
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  // ---------- Render ----------
  if (currentUser) {
    return (
      <Dashboard
        user={currentUser}
        tasks={myTasks}
        onAdd={handleAddTask}
        onToggle={handleToggleTask}
        onDelete={handleDeleteTask}
        onLogout={handleLogout}
      />
    )
  }

  if (authView === 'signup') return <SignupForm onSignup={handleSignup} onSwitch={setAuthView} />
  if (authView === 'forgot') return <ForgotPasswordForm onReset={handleReset} onSwitch={setAuthView} />
  return <LoginForm onLogin={handleLogin} onSwitch={setAuthView} />
}
