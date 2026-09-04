import { teamMembers } from '../data/team'

const columns = [{ id: 'todo', label: 'TO DO', color: 'blue' }, { id: 'doing', label: 'DOING', color: 'amber' }, { id: 'done', label: 'DONE', color: 'green' }]
const label = (date) => date ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(`${date}T12:00:00`)) : '—'

export default function KanbanBoard({ tasks, onNewTask, onEditTask, onDeleteTask, onMoveTask }) {
  const today = new Date().toISOString().slice(0, 10)
  return <><div className="page-intro"><div><p className="eyebrow">Workspace</p><h1>Project board</h1><p className="subtext">Move work forward, one card at a time.</p></div><button className="primary-button" onClick={onNewTask}>+ New task</button></div>
    <div className="board">{columns.map((column) => {
      const columnTasks = tasks.filter((task) => task.status === column.id)
      return <section className={`kanban-column ${column.color}`} key={column.id} onDragOver={(event) => event.preventDefault()} onDrop={(event) => onMoveTask(event.dataTransfer.getData('text/plain'), column.id)}>
        <div className="column-header"><div><span className="column-dot" /><span>{column.label}</span></div><span className="task-count">{columnTasks.length}</span></div>
        <div className="task-list">{columnTasks.map((task) => { const person = teamMembers.find((member) => member.id === task.personId); const overdue = task.status !== 'done' && task.dueDate < today; return <article className="task-card" draggable onDragStart={(event) => event.dataTransfer.setData('text/plain', task.id)} key={task.id}>
          <div className="card-top"><span className="category-tag">{task.category}</span><div className="card-actions"><button onClick={() => onEditTask(task)} aria-label={`Edit ${task.title}`}>✎</button><button onClick={() => onDeleteTask(task)} aria-label={`Delete ${task.title}`}>×</button></div></div>
          <h3>{task.title}</h3>{task.description && <p>{task.description}</p>}
          <div className="date-row"><span className={overdue ? 'overdue' : ''}>◷ Due {label(task.dueDate)}{overdue ? ' · Overdue' : ''}</span>{task.status === 'done' && <span className="complete">✓ {label(task.completeDate)}</span>}</div>
          <div className="card-footer"><div className="assignee"><span className="avatar" style={{ backgroundColor: person?.color }}>{person?.initials}</span><span>{person?.name}</span></div><select value={task.status} aria-label={`Move ${task.title}`} onChange={(event) => onMoveTask(task.id, event.target.value)}><option value="todo">To do</option><option value="doing">Doing</option><option value="done">Done</option></select></div>
        </article>})}{columnTasks.length === 0 && <p className="empty-state">Drop tasks here</p>}</div>
      </section>
    })}</div></>
}
