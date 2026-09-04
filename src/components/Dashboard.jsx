const statusMeta = [{ key: 'todo', label: 'To do', color: '#3b82f6' }, { key: 'doing', label: 'Doing', color: '#f59e0b' }, { key: 'done', label: 'Done', color: '#10b981' }]

export default function Dashboard({ tasks, categories }) {
  const count = (status) => tasks.filter((task) => task.status === status).length
  const statuses = statusMeta.map((item) => ({ ...item, value: count(item.key) }))
  const today = new Date().toISOString().slice(0, 10)
  const overdue = tasks.filter((task) => task.status !== 'done' && task.dueDate < today).length
  const categoryCounts = categories.map((category) => ({ label: category, value: tasks.filter((task) => task.category === category).length })).filter((item) => item.value > 0)
  const performance = { Early: 0, 'On time': 0, Late: 0 }
  tasks.filter((task) => task.status === 'done' && task.completeDate && task.dueDate).forEach((task) => { performance[task.completeDate < task.dueDate ? 'Early' : task.completeDate === task.dueDate ? 'On time' : 'Late'] += 1 })
  const total = tasks.length || 1
  let progress = 0
  const segments = statuses.map((item) => { const start = progress; progress += item.value / total * 100; return `${item.color} ${start}% ${progress}%` }).join(', ')
  const cards = [{ label: 'Total tasks', value: tasks.length, icon: '▦' }, { label: 'To do', value: statuses[0].value, icon: '○' }, { label: 'In progress', value: statuses[1].value, icon: '◐' }, { label: 'Completed', value: statuses[2].value, icon: '✓' }, { label: 'Overdue', value: overdue, icon: '!' }]
  const maxCategory = Math.max(...categoryCounts.map((item) => item.value), 1)
  const completed = Object.values(performance).reduce((sum, value) => sum + value, 0) || 1
  return <><div className="page-intro"><div><p className="eyebrow">Insights</p><h1>Project dashboard</h1><p className="subtext">A quick view of your team’s progress.</p></div></div>
    <div className="summary-grid">{cards.map((card) => <article className="summary-card" key={card.label}><span className="summary-icon">{card.icon}</span><div><p>{card.label}</p><strong>{card.value}</strong></div></article>)}</div>
    <div className="charts-grid"><section className="chart-card"><div className="chart-title"><div><h2>Task status</h2><p>Work distribution across the board</p></div></div><div className="donut-area"><div className="donut" style={{ background: `conic-gradient(${segments})` }}><span><strong>{tasks.length}</strong><small>tasks</small></span></div><div className="legend">{statuses.map((item) => <div key={item.key}><i style={{ background: item.color }} />{item.label}<strong>{item.value}</strong></div>)}</div></div></section>
      <section className="chart-card"><div className="chart-title"><div><h2>Tasks by category</h2><p>Where the team is spending time</p></div></div><div className="bar-chart">{categoryCounts.length ? categoryCounts.map((item) => <div className="bar-row" key={item.label}><span>{item.label}</span><div><i style={{ width: `${item.value / maxCategory * 100}%` }} /></div><strong>{item.value}</strong></div>) : <p className="empty-state">Create tasks to see category data.</p>}</div></section>
      <section className="chart-card performance-card"><div className="chart-title"><div><h2>Completion performance</h2><p>Finished tasks compared with their due dates</p></div></div><div className="performance-bars">{Object.entries(performance).map(([label, value]) => <div key={label}><div className="performance-track"><i className={label.toLowerCase().replace(' ', '-')} style={{ height: `${value / completed * 100}%` }} /></div><strong>{value}</strong><span>{label}</span></div>)}</div></section></div>
  </>
}
