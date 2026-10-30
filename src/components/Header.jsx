export default function Header({ user, onLogout }) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">✓</span>
        <span>Student Task Manager</span>
      </div>
      <div className="topbar-right">
        <span className="hello">Hi, {user.name}</span>
        <button type="button" className="btn ghost" onClick={onLogout}>
          Log out
        </button>
      </div>
    </header>
  )
}
