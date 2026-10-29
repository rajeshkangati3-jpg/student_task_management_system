import { useEffect, useMemo, useState } from "react";
import "./App.css";

const USERS_KEY = "stms_users_v1";
const SESSION_KEY = "stms_session_v1";
const TASKS_KEY = "stms_tasks_v1";

function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getUserTasks(email) {
  const allTasks = readJSON(TASKS_KEY, {});
  return Array.isArray(allTasks[email]) ? allTasks[email] : [];
}

function saveUserTasks(email, tasks) {
  const allTasks = readJSON(TASKS_KEY, {});
  allTasks[email] = tasks;
  saveJSON(TASKS_KEY, allTasks);
}

function Brand({ compact = false }) {
  return (
    <div className={`brand ${compact ? "brand-compact" : ""}`}>
      <div className="brand-icon">✓</div>
      {!compact && (
        <div>
          <div className="brand-name">TaskNest</div>
          <div className="brand-caption">STUDENT TASK MANAGER</div>
        </div>
      )}
    </div>
  );
}

function AuthLayout({ children, mode }) {
  const messages = {
    login: ["Welcome back!", "Sign in to continue managing your student life."],
    signup: ["Create your account", "Build better study habits, one task at a time."],
    forgot: ["Reset your password", "Get back to your tasks in just a few steps."]
  };
  return (
    <main className="auth-shell">
      <section className="auth-art">
        <Brand />
        <div className="art-copy">
          <div className="eyebrow">PLAN SMARTER. STUDY BETTER.</div>
          <h1>Your goals,<br />one task at a time.</h1>
          <p>Keep assignments, deadlines, and daily goals organized in one simple space.</p>
          <div className="art-checklist">
            <div><span>✓</span> Organize your study day</div>
            <div><span>✓</span> Track your progress</div>
            <div><span>✓</span> Celebrate every small win</div>
          </div>
        </div>
        <div className="art-footer">A little progress each day adds up.</div>
        <div className="decor decor-one"></div>
        <div className="decor decor-two"></div>
      </section>
      <section className="auth-panel">
        <div className="auth-mobile-brand"><Brand /></div>
        <div className="auth-card">
          <div className="auth-heading">
            <div className="eyebrow">{mode === "login" ? "YOUR SPACE IS READY" : mode === "signup" ? "GET STARTED FREE" : "ACCOUNT RECOVERY"}</div>
            <h2>{messages[mode][0]}</h2>
            <p>{messages[mode][1]}</p>
          </div>
          {children}
        </div>
        <div className="auth-bottom">© 2026 TaskNest · Student Task Management System</div>
      </section>
    </main>
  );
}

function App() {
  const [users, setUsers] = useState(() => readJSON(USERS_KEY, []));
  const [session, setSession] = useState(() => readJSON(SESSION_KEY, null));
  const [page, setPage] = useState(() => readJSON(SESSION_KEY, null) ? "dashboard" : "login");
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("success");
  const [tasks, setTasks] = useState(() => {
    const savedSession = readJSON(SESSION_KEY, null);
    return savedSession?.email ? getUserTasks(savedSession.email) : [];
  });
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", newPassword: "" });
  const [taskForm, setTaskForm] = useState({ title: "", subject: "", dueDate: "", priority: "Medium" });
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => saveJSON(USERS_KEY, users), [users]);
  useEffect(() => {
    if (session) {
      saveJSON(SESSION_KEY, session);
      saveUserTasks(session.email, tasks);
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [session, tasks]);

  const updateForm = (field, value) => setForm(current => ({ ...current, [field]: value }));
  const updateTaskForm = (field, value) => setTaskForm(current => ({ ...current, [field]: value }));
  const showNotice = (message, type = "success") => {
    setNotice(message);
    setNoticeType(type);
  };

  function handleSignup(event) {
    event.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    if (!name || !email || !form.password || !form.confirm) return showNotice("Please fill in every field.", "error");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showNotice("Please enter a valid email address.", "error");
    if (form.password.length < 6) return showNotice("Password must contain at least 6 characters.", "error");
    if (form.password !== form.confirm) return showNotice("Passwords do not match.", "error");
    if (users.some(user => user.email === email)) return showNotice("An account with this email already exists. Please log in.", "error");
    const newUser = { name, email, password: form.password };
    setUsers(current => [...current, newUser]);
    setSession({ name, email });
    setTasks([]);
    setPage("dashboard");
    setForm({ name: "", email: "", password: "", confirm: "", newPassword: "" });
    showNotice("Account created! Welcome to TaskNest.");
  }

  function handleLogin(event) {
    event.preventDefault();
    const email = form.email.trim().toLowerCase();
    const user = users.find(item => item.email === email && item.password === form.password);
    if (!user) return showNotice("Email or password is incorrect. Try signing up first.", "error");
    const userSession = { name: user.name, email: user.email };
    setSession(userSession);
    setTasks(getUserTasks(user.email));
    setPage("dashboard");
    setForm({ name: "", email: "", password: "", confirm: "", newPassword: "" });
    showNotice(`Welcome back, ${user.name.split(" ")[0]}!`);
  }

  function handleReset(event) {
    event.preventDefault();
    const email = form.email.trim().toLowerCase();
    const user = users.find(item => item.email === email);
    if (!user) return showNotice("No account found for that email. Please sign up first.", "error");
    if (form.newPassword.length < 6) return showNotice("New password must contain at least 6 characters.", "error");
    setUsers(current => current.map(item => item.email === email ? { ...item, password: form.newPassword } : item));
    setForm({ name: "", email: "", password: "", confirm: "", newPassword: "" });
    setPage("login");
    showNotice("Password updated. Please log in with your new password.");
  }

  function logout() {
    setSession(null);
    setTasks([]);
    setPage("login");
    setFilter("All");
    setSearch("");
    showNotice("You have logged out successfully.");
  }

  function addTask(event) {
    event.preventDefault();
    if (!taskForm.title.trim()) return showNotice("Please enter a task title.", "error");
    const newTask = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: taskForm.title.trim(),
      subject: taskForm.subject.trim() || "General",
      dueDate: taskForm.dueDate,
      priority: taskForm.priority,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTasks(current => [newTask, ...current]);
    setTaskForm({ title: "", subject: "", dueDate: "", priority: "Medium" });
    showNotice("Task added successfully.");
  }

  function toggleTask(id) {
    setTasks(current => current.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  }

  function deleteTask(id) {
    setTasks(current => current.filter(task => task.id !== id));
    showNotice("Task deleted.");
  }

  const completedCount = tasks.filter(task => task.completed).length;
  const pendingCount = tasks.length - completedCount;
  const today = new Date().toISOString().slice(0, 10);
  const overdueCount = tasks.filter(task => !task.completed && task.dueDate && task.dueDate < today).length;
  const visibleTasks = useMemo(() => tasks.filter(task => {
    const matchesFilter = filter === "All" || (filter === "Pending" && !task.completed) || (filter === "Completed" && task.completed);
    const query = search.toLowerCase();
    return matchesFilter && `${task.title} ${task.subject} ${task.priority}`.toLowerCase().includes(query);
  }), [tasks, filter, search]);

  function switchPage(nextPage) {
    setNotice("");
    setPage(nextPage);
    setForm({ name: "", email: "", password: "", confirm: "", newPassword: "" });
  }

  if (!session || page !== "dashboard") {
    if (page === "signup") {
      return (
        <AuthLayout mode="signup">
          <form className="auth-form" onSubmit={handleSignup}>
            {notice && <div className={`notice ${noticeType}`}>{notice}</div>}
            <label>Full name</label>
            <input value={form.name} onChange={e => updateForm("name", e.target.value)} placeholder="Enter your full name" autoComplete="name" />
            <label>Email address</label>
            <input type="email" value={form.email} onChange={e => updateForm("email", e.target.value)} placeholder="you@example.com" autoComplete="email" />
            <label>Password</label>
            <input type="password" value={form.password} onChange={e => updateForm("password", e.target.value)} placeholder="At least 6 characters" autoComplete="new-password" />
            <label>Confirm password</label>
            <input type="password" value={form.confirm} onChange={e => updateForm("confirm", e.target.value)} placeholder="Enter password again" autoComplete="new-password" />
            <button className="primary-btn" type="submit">Create account <span>→</span></button>
          </form>
          <p className="auth-switch">Already have an account? <button onClick={() => switchPage("login")}>Log in</button></p>
          <p className="demo-note">Demo note: account details are stored in this browser only.</p>
        </AuthLayout>
      );
    }

    if (page === "forgot") {
      return (
        <AuthLayout mode="forgot">
          <form className="auth-form" onSubmit={handleReset}>
            {notice && <div className={`notice ${noticeType}`}>{notice}</div>}
            <label>Registered email address</label>
            <input type="email" value={form.email} onChange={e => updateForm("email", e.target.value)} placeholder="you@example.com" autoComplete="email" />
            <label>New password</label>
            <input type="password" value={form.newPassword} onChange={e => updateForm("newPassword", e.target.value)} placeholder="At least 6 characters" autoComplete="new-password" />
            <p className="field-hint">For this classroom demo, enter your registered email and choose a new password. No email is sent.</p>
            <button className="primary-btn" type="submit">Reset password <span>→</span></button>
          </form>
          <p className="auth-switch"><button onClick={() => switchPage("login")}>← Back to login</button></p>
        </AuthLayout>
      );
    }

    return (
      <AuthLayout mode="login">
        <form className="auth-form" onSubmit={handleLogin}>
          {notice && <div className={`notice ${noticeType}`}>{notice}</div>}
          <label>Email address</label>
          <input type="email" value={form.email} onChange={e => updateForm("email", e.target.value)} placeholder="you@example.com" autoComplete="email" />
          <div className="label-row"><label>Password</label><button type="button" className="text-link" onClick={() => switchPage("forgot")}>Forgot password?</button></div>
          <input type="password" value={form.password} onChange={e => updateForm("password", e.target.value)} placeholder="Enter your password" autoComplete="current-password" />
          <button className="primary-btn" type="submit">Log in <span>→</span></button>
        </form>
        <p className="auth-switch">Don't have an account? <button onClick={() => switchPage("signup")}>Create account</button></p>
        <p className="demo-note">New here? Create an account to try the dashboard.</p>
      </AuthLayout>
    );
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <Brand />
        <div className="side-label">WORKSPACE</div>
        <button className="side-link active"><span>▦</span> My Dashboard</button>
        <div className="side-label side-label-spaced">TASK VIEWS</div>
        <button className={`side-link ${filter === "All" ? "selected" : ""}`} onClick={() => setFilter("All")}><span>☷</span> All tasks <b>{tasks.length}</b></button>
        <button className={`side-link ${filter === "Pending" ? "selected" : ""}`} onClick={() => setFilter("Pending")}><span>◷</span> Pending <b>{pendingCount}</b></button>
        <button className={`side-link ${filter === "Completed" ? "selected" : ""}`} onClick={() => setFilter("Completed")}><span>✓</span> Completed <b>{completedCount}</b></button>
        <div className="sidebar-bottom">
          <div className="tip-card"><div className="tip-icon">✦</div><strong>Study tip</strong><p>Break big assignments into smaller tasks to make progress every day.</p></div>
          <button className="side-link logout-link" onClick={logout}><span>↪</span> Log out</button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="topbar">
          <div className="mobile-brand"><Brand /></div>
          <div className="breadcrumb">Workspace <span>/</span> <strong>My Dashboard</strong></div>
          <div className="profile"><div className="avatar">{session.name.slice(0, 1).toUpperCase()}</div><div><strong>{session.name}</strong><small>Student account</small></div><button className="top-logout" onClick={logout}>Log out</button></div>
        </header>

        <section className="welcome-row">
          <div><div className="eyebrow">YOUR PERSONAL STUDY SPACE</div><h1>Good work starts with a plan, {session.name.split(" ")[0]} <span>✦</span></h1><p>Keep your tasks organized and make today count.</p></div>
          <div className="date-pill">▦ &nbsp; {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</div>
        </section>

        {notice && <div className={`notice dashboard-notice ${noticeType}`}>{notice}<button onClick={() => setNotice("")}>×</button></div>}

        <section className="stats-grid">
          <div className="stat-card"><div className="stat-top"><span>Total tasks</span><div className="stat-icon blue">☷</div></div><div className="stat-number">{tasks.length}</div><div className="stat-foot">All your study tasks</div></div>
          <div className="stat-card"><div className="stat-top"><span>Pending</span><div className="stat-icon orange">◷</div></div><div className="stat-number">{pendingCount}</div><div className="stat-foot">Tasks to work on</div></div>
          <div className="stat-card"><div className="stat-top"><span>Completed</span><div className="stat-icon green">✓</div></div><div className="stat-number">{completedCount}</div><div className="stat-foot">Great progress so far</div></div>
          <div className="stat-card"><div className="stat-top"><span>Overdue</span><div className="stat-icon red">!</div></div><div className="stat-number">{overdueCount}</div><div className="stat-foot">Past due date and pending</div></div>
        </section>

        <section className="content-grid">
          <div className="panel add-panel">
            <div className="panel-heading"><div><h2>Add a new task</h2><p>Write down what you need to get done.</p></div><div className="panel-heading-icon">＋</div></div>
            <form className="task-form" onSubmit={addTask}>
              <label>Task title <span>*</span></label>
              <input value={taskForm.title} onChange={e => updateTaskForm("title", e.target.value)} placeholder="e.g. Complete React assignment" />
              <label>Subject / category</label>
              <input value={taskForm.subject} onChange={e => updateTaskForm("subject", e.target.value)} placeholder="e.g. Web Development" />
              <div className="form-two">
                <div><label>Due date</label><input type="date" min={today} value={taskForm.dueDate} onChange={e => updateTaskForm("dueDate", e.target.value)} /></div>
                <div><label>Priority</label><select value={taskForm.priority} onChange={e => updateTaskForm("priority", e.target.value)}><option>Low</option><option>Medium</option><option>High</option></select></div>
              </div>
              <button className="primary-btn add-btn" type="submit">＋ Add task</button>
            </form>
          </div>

          <div className="panel tasks-panel">
            <div className="panel-heading task-heading"><div><h2>Your tasks</h2><p>Stay on top of your assignments.</p></div><span className="task-count">{visibleTasks.length} tasks</span></div>
            <div className="task-toolbar"><div className="filter-tabs">{["All", "Pending", "Completed"].map(item => <button key={item} className={filter === item ? "filter-active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="search-box"><span>⌕</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks" /></div></div>
            <div className="task-list">
              {visibleTasks.length === 0 ? (
                <div className="empty-state"><div className="empty-icon">☷</div><strong>{search ? "No matching tasks" : filter === "Completed" ? "No completed tasks yet" : "Your task list is empty"}</strong><p>{search ? "Try another search term." : "Add a task to get your study plan started."}</p></div>
              ) : visibleTasks.map(task => (
                <article className={`task-item ${task.completed ? "task-done" : ""}`} key={task.id}>
                  <button className={`task-check ${task.completed ? "checked" : ""}`} onClick={() => toggleTask(task.id)} aria-label={task.completed ? "Mark as pending" : "Mark as completed"}>{task.completed ? "✓" : ""}</button>
                  <div className="task-details"><strong>{task.title}</strong><div className="task-meta"><span>{task.subject}</span>{task.dueDate && <span>Due {new Date(`${task.dueDate}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>}</div></div>
                  <span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                  <button className="delete-task" onClick={() => deleteTask(task.id)} aria-label="Delete task" title="Delete task">×</button>
                </article>
              ))}
            </div>
            <div className="task-panel-footer"><span><span className="footer-dot"></span> Your progress is saved in this browser</span><span>{completedCount}/{tasks.length} completed</span></div>
          </div>
        </section>
        <footer className="dashboard-footer">Made for students, one task at a time. <span>TaskNest · Student Task Management System</span></footer>
      </main>
    </div>
  );
}

export default App;
