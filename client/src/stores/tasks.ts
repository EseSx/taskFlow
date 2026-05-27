// ── Store de tareas ───────────────────────────────────────────────
// Maneja el estado global de las tareas del usuario
// Se conecta al backend a través del taskService
// Incluye: loading states, manejo de errores y filtros

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as taskService from '@/services/taskService'
import type { Task, CreateTaskData, UpdateTaskData, TaskFilters } from '@/services/taskService'

export const useTasksStore = defineStore('tasks', () => {
  // ── Estado ───────────────────────────────────────────────────────
  const tasks = ref<Task[]>([])          // Lista de tareas del usuario
  const currentTask = ref<Task | null>(null) // Tarea seleccionada para el detalle
  const loading = ref(false)             // Indica si hay una operación en curso
  const error = ref<string | null>(null) // Mensaje de error (null = sin error)

  // Filtros activos para la lista de tareas
  const filters = ref<TaskFilters>({
    completed: undefined,
    priority: undefined,
    search: undefined,
  })

  // ── Getters ──────────────────────────────────────────────────────

  // Cantidad de tareas pendientes (sin completar)
  const pendingCount = computed(() => tasks.value.filter((t) => !t.completed).length)

  // Cantidad de tareas completadas
  const completedCount = computed(() => tasks.value.filter((t) => t.completed).length)

  // ── Actions ───────────────────────────────────────────────────────

  // Carga todas las tareas del usuario desde el backend
  const fetchTasks = async () => {
    loading.value = true
    error.value = null
    try {
      // Filtramos los valores undefined antes de enviar al backend
      const activeFilters = Object.fromEntries(
        Object.entries(filters.value).filter(([_, v]) => v !== undefined)
      ) as Record<string, string>

      const response = await taskService.fetchTasks(activeFilters)
      tasks.value = response.data.tasks
    } catch (err: unknown) {
      // Capturamos el mensaje de error para mostrarlo en la UI
      error.value = err instanceof Error ? err.message : 'Error al cargar las tareas'
    } finally {
      // Siempre desactivamos el loading, haya error o no
      loading.value = false
    }
  }

  // Carga el detalle de una tarea específica
  const fetchTask = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await taskService.fetchTask(id)
      currentTask.value = response.data.task
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Error al cargar la tarea'
    } finally {
      loading.value = false
    }
  }

  // Crea una nueva tarea y la agrega al listado
  const createTask = async (data: CreateTaskData) => {
    loading.value = true
    error.value = null
    try {
      const response = await taskService.createTask(data)
      // Insertamos la nueva tarea al inicio de la lista (más reciente primero)
      tasks.value.unshift(response.data.task)
      return response.data.task
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Error al crear la tarea'
      throw err // Re-lanzamos para que el componente pueda reaccionar
    } finally {
      loading.value = false
    }
  }

  // Actualiza una tarea y refleja los cambios en el listado
  const updateTask = async (id: number, data: UpdateTaskData) => {
    loading.value = true
    error.value = null
    try {
      const response = await taskService.updateTask(id, data)
      const updated = response.data.task

      // Reemplazamos la tarea en el array sin recargar toda la lista
      const index = tasks.value.findIndex((t) => t.id === id)
      if (index !== -1) tasks.value[index] = updated

      // También actualizamos la tarea actual si es la misma
      if (currentTask.value?.id === id) currentTask.value = updated

      return updated
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Error al actualizar la tarea'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Elimina una tarea del backend y del listado local
  const deleteTask = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await taskService.deleteTask(id)
      // Removemos la tarea del array local
      tasks.value = tasks.value.filter((t) => t.id !== id)
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Error al eliminar la tarea'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actualiza los filtros y recarga la lista
  const setFilters = async (newFilters: TaskFilters) => {
    filters.value = { ...filters.value, ...newFilters }
    await fetchTasks() // Recargamos con los nuevos filtros
  }

  // Limpia el estado de error
  const clearError = () => {
    error.value = null
  }

  return {
    tasks,
    currentTask,
    loading,
    error,
    filters,
    pendingCount,
    completedCount,
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    setFilters,
    clearError,
  }
})