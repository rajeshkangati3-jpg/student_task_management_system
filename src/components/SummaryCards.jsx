export default function SummaryCards({ stats }) {
  const cards = [
    { label: 'Total', value: stats.total, tone: 'blue' },
    { label: 'Pending', value: stats.pending, tone: 'amber' },
    { label: 'Completed', value: stats.completed, tone: 'green' },
    { label: 'Overdue', value: stats.overdue, tone: 'red' },
  ]

  return (
    <section className="summary" aria-label="Task summary">
      {cards.map((card) => (
        <div key={card.label} className={`summary-card ${card.tone}`}>
          <span className="summary-value">{card.value}</span>
          <span className="summary-label">{card.label}</span>
        </div>
      ))}
    </section>
  )
}
