export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">✓</span>
          <span>Student Task Manager</span>
        </div>
        <h1>{title}</h1>
        <p className="muted">{subtitle}</p>
        {children}
        <div className="auth-footer">{footer}</div>
      </section>
    </main>
  )
}
