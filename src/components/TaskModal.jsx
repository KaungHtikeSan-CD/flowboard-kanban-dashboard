import { useEffect, useState } from 'react'
import { teamMembers } from '../data/team'

const emptyTask = { title: '', description: '', category: '', startDate: '', dueDate: '', completeDate: '', personId: '', status: 'todo' }

export default function TaskModal({ task, categories, onClose, onSave, onAddCategory }) {
  const [form, setForm] = useState(emptyTask)
  const [newCategory, setNewCategory] = useState('')
  const [showCategory, setShowCategory] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setForm(task ? { ...task } : { ...emptyTask, category: categories[0] || '', personId: teamMembers[0]?.id || '' })
    setError('')
  }, [task, categories])
  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setError('')
  }
  const submit = (event) => {
    event.preventDefault()
    if (!form.title.trim() || !form.category || !form.startDate || !form.dueDate || !form.personId) {
      setError('Please complete all required fields before saving the task.')
      return
    }
    if (form.dueDate < form.startDate) {
      setError('The due date cannot be earlier than the start date.')
      return
    }
    if (form.status === 'done' && !form.completeDate) {
      setError('Please select the date when this task was completed.')
      return
    }
    onSave({ ...form, title: form.title.trim(), description: form.description.trim() })
  }
  const addCategory = () => {
    const name = newCategory.trim()
    if (!name) {
      setError('Enter a category name first.')
      return
    }
    if (categories.some((category) => category.toLowerCase() === name.toLowerCase())) {
      setError('This category already exists. Choose it from the list instead.')
      return
    }
    onAddCategory(name)
    update('category', name)
    setNewCategory('')
    setShowCategory(false)
  }

  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
    <section className="modal" role="dialog" aria-modal="true" aria-labelledby="task-modal-title" onMouseDown={(event) => event.stopPropagation()}>
      <div className="modal-heading"><div><p className="eyebrow">{task ? 'Update work item' : 'Plan a new work item'}</p><h2 id="task-modal-title">{task ? 'Edit task' : 'Create task'}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close">×</button></div>
      <form onSubmit={submit}>
        <label>Task title<input autoFocus value={form.title} onChange={(event) => update('title', event.target.value)} placeholder="What needs to be done?" required /></label>
        <label>Description<textarea value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="Add helpful details (optional)" rows="3" /></label>
        <div className="form-grid">
          <label>Category<select value={form.category} onChange={(event) => update('category', event.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
          <label>Responsible person<select value={form.personId} onChange={(event) => update('personId', event.target.value)}>{teamMembers.map((person) => <option value={person.id} key={person.id}>{person.name}</option>)}</select></label>
          <label>Start date<input type="date" value={form.startDate} onChange={(event) => update('startDate', event.target.value)} required /></label>
          <label>Due date<input type="date" value={form.dueDate} onChange={(event) => update('dueDate', event.target.value)} required /></label>
        </div>
        {form.status === 'done' && <label>Complete date<input type="date" value={form.completeDate} onChange={(event) => update('completeDate', event.target.value)} required /></label>}
        <div className="category-add">{showCategory ? <><input value={newCategory} onChange={(event) => { setNewCategory(event.target.value); setError('') }} placeholder="New category name" /><button type="button" className="text-button" onClick={addCategory}>Save category</button></> : <button type="button" className="text-button" onClick={() => setShowCategory(true)}>+ Add a new category</button>}</div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit">{task ? 'Save changes' : 'Create task'}</button></div>
      </form>
    </section>
  </div>
}
