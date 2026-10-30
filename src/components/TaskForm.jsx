import { useState } from 'react'

const EMPTY = { title: '', subject: '', dueDate: '', priority: 'Medium' }

export default function TaskForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')

  function update(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Please enter a task title.')
      return
    }
    if (!form.dueDate) {
      setError('Please choose a due date.')
      return
    }
    setError('')
    onAdd({
      title: form.title.trim(),
      subject: form.subject.trim() || 'General',
      dueDate: form.dueDate,
      priority: form.priority,
    })
    setForm(EMPTY)
  }

  return (
    <section className="panel">
      <h2>Add a task</h2>
      <form className="task-form" onSubmit={handleSubmit} noValidate>
        <label className="wide">
          Title
          <input
            type="text"
            value={form.title}
            onChange={update('title')}
            placeholder="e.g. Finish chemistry assignment"
          />
        </label>
        <label>
          Subject
          <input
            type="text"
            value={form.subject}
            onChange={update('subject')}
            placeholder="e.g. Chemistry"
          />
        </label>
        <label>
          Due date
          <input type="date" value={form.dueDate} onChange={update('dueDate')} />
        </label>
        <label>
          Priority
          <select value={form.priority} onChange={update('priority')}>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </label>
        <div className="form-actions">
          <button type="submit" className="btn primary">Add task</button>
        </div>
        {error && <p className="alert error wide" role="alert">{error}</p>}
      </form>
    </section>
  )
}
