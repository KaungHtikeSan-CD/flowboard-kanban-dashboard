import { useEffect, useMemo, useState } from 'react'
import KanbanBoard from './components/KanbanBoard'
import Dashboard from './components/Dashboard'
import TaskModal from './components/TaskModal'
import { loadCategories, loadTasks, saveCategories, saveTasks } from './utils/storage'
import './App.css'

const today = () => new Date().toISOString().slice(0, 10)

export default function App() {
  const [page, setPage] = useState('board')
  const [tasks, setTasks] = useState(loadTasks)
  const [categories, setCategories] = useState(loadCategories)
  const [editingTask, setEditingTask] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => saveTasks(tasks), [tasks])
  useEffect(() => saveCategories(categories), [categories])
  const modalTask = useMemo(() => editingTask, [editingTask])
  const openNewTask = () => { setEditingTask(null); setModalOpen(true) }
  const saveTask = (task) => {
    if (task.id) setTasks((items) => items.map((item) => item.id === task.id ? task : item))
    else setTasks((items) => [{ ...task, id: crypto.randomUUID(), completeDate: task.status === 'done' ? (task.completeDate || today()) : '' }, ...items])
    setModalOpen(false)
  }
  const moveTask = (id, status) => setTasks((items) => items.map((task) => task.id !== id ? task : { ...task, status, completeDate: status === 'done' ? (task.completeDate || today()) : '' }))
  const deleteTask = (task) => { if (window.confirm(`Delete “${task.title}”? This cannot be undone.`)) setTasks((items) => items.filter((item) => item.id !== task.id)) }
  const addCategory = (name) => setCategories((items) => items.some((item) => item.toLowerCase() === name.toLowerCase()) ? items : [...items, name])
  return <div className="app-shell"><aside className="sidebar"><a className="brand" href="#board"><span>F</span> FlowBoard</a><nav><button className={page === 'board' ? 'active' : ''} onClick={() => setPage('board')}><span>▦</span> Kanban board</button><button className={page === 'dashboard' ? 'active' : ''} onClick={() => setPage('dashboard')}><span>◔</span> Dashboard</button></nav><div className="sidebar-note"><span>✦</span><p><strong>Keep it flowing</strong>Plan, focus, and finish together.</p></div></aside><main><header><div className="mobile-brand"><span>F</span> FlowBoard</div><div className="header-right"><span className="saved"><i /> Saved locally</span><div className="profile">Team <b>3</b></div></div></header><div className="content">{page === 'board' ? <KanbanBoard tasks={tasks} onNewTask={openNewTask} onEditTask={(task) => { setEditingTask(task); setModalOpen(true) }} onDeleteTask={deleteTask} onMoveTask={moveTask} /> : <Dashboard tasks={tasks} categories={categories} />}</div></main>{modalOpen && <TaskModal task={modalTask} categories={categories} onClose={() => setModalOpen(false)} onSave={saveTask} onAddCategory={addCategory} />}</div>
}
