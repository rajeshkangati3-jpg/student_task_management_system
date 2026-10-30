import { formatDate, todayString } from '../utils/storage.js'

export default function TaskItem({ task, onToggle, onDelete }) {
  const overdue = !task.completed && task.dueDate < todayString()

  return (
    <li className={`task ${task.completed ? 'done' : ''} ${overdue ? 'overdue' : ''}`}>
      <input
        type="checkbox"
        className="task-check"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={`Mark "${task.title}" as ${task.completed ? 'pending' : 'completed'}`}
      />
      <div className="task-body">
        <h3 className="task-title">{task.title}</h3>
        <div className="task-meta">
          <span className="tag subject">{task.subject}</span>
          <span className={`tag priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
          <span className="due">Due {formatDate(task.dueDate)}</span>
          {task.completed && <span className="tag status done">Completed</span>}
          {overdue && <span className="tag status late">Overdue</span>}
        </div>
      </div>
      <button
        type="button"
        className="btn danger small"
        onClick={() => onDelete(task.id)}
        aria-label={`Delete "${task.title}"`}
      >
        Delete
      </button>
    </li>
  )
}
