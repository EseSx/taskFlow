// ---------- Servicio de tareas (frontend) ----------
import { api } from './api'

// ---------- Tipos ----------

// ---------- Tipo de datos de una subtarea ----------
export interface SubTask {
  id: number
  title: string
  completed: boolean
  order: number
  taskId: number
  createdAt: string
  updatedAt: string
}

// ---------- Tipo de datos de una tarea ----------
export interface Task {
  id: number
  title: string
  description: string | null
  completed: boolean
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  dueDate: string | null
  userId: number
  subtasks: SubTask[]
  createdAt: string
  updatedAt: string
}

// ---------- Tipo para crear una nueva tarea ----------
export interface CreateTaskData {
  title: string
  description?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  dueDate?: string
}

// ---------- Tipo para actualizar una tarea ----------
export interface UpdateTaskData extends Partial<CreateTaskData> {
  completed?: boolean
}

// --------- Tipo para crear una nueva subtarea ----------
export interface CreateSubTaskData {
  title: string
}

// ---------- Tipo para actualizar una subtarea ----------
export interface UpdateSubTaskData {
  title?: string
  completed?: boolean
  order?: number
}

// ---------- Tipo para reordenar tareas o subtareas ----------
export interface ReorderItem {
  id: number
  order: number
}

// ---------- Tasks API ----------
export const taskService = {
  getAll: (params?: Record<string, string>) => api.get<Task[]>('/tasks', { params }),

  getById: (id: number) => api.get<Task>(`/tasks/${id}`),

  create: (data: CreateTaskData) => api.post<Task>('/tasks', data),

  update: (id: number, data: UpdateTaskData) => api.put<Task>(`/tasks/${id}`, data),

  delete: (id: number) => api.delete(`/tasks/${id}`),
}

// ---------- SubTasks API ----------
export const subtaskService = {
  getAll: (taskId: number) => api.get<SubTask[]>(`/tasks/${taskId}/subtasks`),

  create: (taskId: number, data: CreateSubTaskData) =>
    api.post<SubTask>(`/tasks/${taskId}/subtasks`, data),

  update: (taskId: number, subtaskId: number, data: UpdateSubTaskData) =>
    api.put<SubTask>(`/tasks/${taskId}/subtasks/${subtaskId}`, data),

  delete: (taskId: number, subtaskId: number) =>
    api.delete(`/tasks/${taskId}/subtasks/${subtaskId}`),

  reorder: (taskId: number, items: ReorderItem[]) =>
    api.put<SubTask[]>(`/tasks/${taskId}/subtasks/reorder`, { items }),
}
