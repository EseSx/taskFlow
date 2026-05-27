// ── Servicio de tareas (frontend) ─────────────────────────────────
// Encapsula todas las llamadas a la API de tareas
// Los stores y componentes usan este servicio en lugar de llamar a la API directamente

import { api } from './api'

// Tipo de datos de una tarea (espejo del modelo de Prisma)
export interface Task {
  id: number
  title: string
  description: string | null
  completed: boolean
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  dueDate: string | null
  createdAt: string
  updatedAt: string
  userId: number
}

// Tipo para crear una nueva tarea
export interface CreateTaskData {
  title: string
  description?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH'
  dueDate?: string
}

// Tipo para actualizar una tarea (todos los campos son opcionales)
export type UpdateTaskData = Partial<CreateTaskData & { completed: boolean }>

// Filtros disponibles para la lista de tareas
export interface TaskFilters {
  completed?: string
  priority?: string
  search?: string
}

// ── Llamadas a la API ─────────────────────────────────────────────

// Obtiene todas las tareas del usuario con filtros opcionales
export const fetchTasks = (filters?: TaskFilters) => {
  return api.get<{ success: boolean; count: number; data: { tasks: Task[] } }>(
    '/tasks',
    filters as Record<string, string>
  )
}

// Obtiene el detalle de una tarea por su id
export const fetchTask = (id: number) => {
  return api.get<{ success: boolean; data: { task: Task } }>(`/tasks/${id}`)
}

// Crea una nueva tarea
export const createTask = (data: CreateTaskData) => {
  return api.post<{ success: boolean; data: { task: Task } }>('/tasks', data)
}

// Actualiza una tarea existente
export const updateTask = (id: number, data: UpdateTaskData) => {
  return api.put<{ success: boolean; data: { task: Task } }>(`/tasks/${id}`, data)
}

// Elimina una tarea
export const deleteTask = (id: number) => {
  return api.delete<null>(`/tasks/${id}`)
}