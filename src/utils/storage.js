import { defaultCategories, starterTasks } from '../data/team'

const TASKS_KEY = 'flowboard_tasks'
const CATEGORIES_KEY = 'flowboard_categories'

export function loadTasks() {
  try { return JSON.parse(localStorage.getItem(TASKS_KEY)) ?? starterTasks } catch { return starterTasks }
}

export function loadCategories() {
  try { return JSON.parse(localStorage.getItem(CATEGORIES_KEY)) ?? defaultCategories } catch { return defaultCategories }
}

export function saveTasks(tasks) { localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)) }
export function saveCategories(categories) { localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories)) }
