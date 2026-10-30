import TaskItem from './TaskItem.jsx'

export default function TaskList({ tasks, hasAnyTasks, onToggle, onDelete }) {
  if (tasks.length === 0) {
    return (
      <p className="empty">
        {hasAnyTasks
          ? 'No tasks match your search or filter.'
          : 'No tasks yet. Add your first task above.'}
      </p>
    )
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  )
}
