import { useMemo, useState } from 'react'
import Header from './Header.jsx'
import SummaryCards from './SummaryCards.jsx'
import TaskForm from './TaskForm.jsx'
import TaskFilters from './TaskFilters.jsx'
import TaskList from './TaskList.jsx'
import { todayString } from '../utils/storage.js'

const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 }

export default function Dashboard({ user, tasks, onAdd, onToggle, onDelete, onLogout }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const stats = useMemo(() => {
    const today = todayString()
    const completed = tasks.filter((t) => t.completed).length
    const overdue = tasks.filter((t) => !t.completed && t.dueDate < today).length
    return {
      total: tasks.length,
      completed,
      pending: tasks.length - completed,
      overdue,
    }
  }, [tasks])

  const visibleTasks = useMemo(() => {
    const today = todayString()
    const query = search.trim().toLowerCase()

    return tasks
      .filter((t) => {
        if (filter === 'pending') return !t.completed
        if (filter === 'completed') return t.completed
        if (filter === 'overdue') return !t.completed && t.dueDate < today
        return true
      })
      .filter((t) => {
        if (!query) return true
        return [t.title, t.subject, t.priority].some((v) => v.toLowerCase().includes(query))
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1
        if (a.dueDate !== b.dueDate) return a.dueDate < b.dueDate ? -1 : 1
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      })
  }, [tasks, filter, search])

  return (
    <div className="app-shell">
      <Header user={user} onLogout={onLogout} />
      <main className="container">
        <SummaryCards stats={stats} />
        <TaskForm onAdd={onAdd} />
        <section className="panel">
          <h2>Your tasks</h2>
          <TaskFilters
            filter={filter}
            onFilter={setFilter}
            search={search}
            onSearch={setSearch}
          />
          <TaskList
            tasks={visibleTasks}
            hasAnyTasks={tasks.length > 0}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        </section>
      </main>
    </div>
  )
}
