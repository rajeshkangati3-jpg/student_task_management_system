const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'completed', label: 'Completed' },
  { id: 'overdue', label: 'Overdue' },
]

export default function TaskFilters({ filter, onFilter, search, onSearch }) {
  return (
    <div className="filters">
      <input
        type="search"
        className="search"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search by title, subject or priority"
        aria-label="Search tasks"
      />
      <div className="chips" role="group" aria-label="Filter tasks">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`chip ${filter === f.id ? 'active' : ''}`}
            aria-pressed={filter === f.id}
            onClick={() => onFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  )
}
