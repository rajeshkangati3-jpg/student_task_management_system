export const KEYS = {
  users: 'stms_users',
  session: 'stms_session',
  tasks: 'stms_tasks',
}

export function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage may be full or blocked; the app keeps working in memory.
  }
}

export function removeStorage(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

// Today's date as YYYY-MM-DD in the user's local time zone.
export function todayString() {
  const d = new Date()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

export function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

// SHA-256 hash so passwords are not stored as plain text.
// (Still a demo only - real apps hash on a server with a salt.)
export async function hashPassword(password) {
  if (window.crypto && window.crypto.subtle) {
    const data = new TextEncoder().encode(password)
    const digest = await window.crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }
  return password
}

export function formatDate(dateString) {
  if (!dateString) return ''
  const [y, m, d] = dateString.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
