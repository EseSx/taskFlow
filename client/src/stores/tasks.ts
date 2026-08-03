// ---------- Store de tareas ----------
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { taskService, subtaskService } from '@/services/taskService'
import type {
  Task,
  SubTask,
  CreateTaskData,
  UpdateTaskData,
  CreateSubTaskData,
  UpdateSubTaskData,
  ReorderItem,
} from '@/services/taskService'

export const useTasksStore = defineStore('tasks', () => {
  // ---------- Estado ----------
  const tasks = ref<Task[]>([]) // Lista de tareas del usuario
  const currentTask = ref<Task | null>(null) // Tarea seleccionada para el detalle
  const loading = ref(false) // Indica si hay una operación en curso
  const error = ref<string | null>(null) // Mensaje de error (null = sin error)

  // Filtros activos para la lista de tareas
  const filters = ref<{ search?: string; priority?: string; completed?: string }>({})

  // ---------- Getters ----------

  // Cantidad de tareas pendientes (sin completar)
  const pendingCount = computed(() => tasks.value.filter((t) => !t.completed).length)

  // Cantidad de tareas completadas
  const completedCount = computed(() => tasks.value.filter((t) => t.completed).length)

  // Función auxiliar para establecer el mensaje de error
  const setError = (e: unknown) => {
    error.value = e instanceof Error ? e.message : 'Error desconocido'
  }

  // ---------- Actions : Tasks ----------

  const fetchTasks = async () => {
    // Obtener la lista de tareas del usuario
    loading.value = true
    error.value = null
    try {
      const params: Record<string, string> = {}
      if (filters.value.search) params.search = filters.value.search
      if (filters.value.priority) params.priority = filters.value.priority
      if (filters.value.completed) params.completed = filters.value.completed
      tasks.value = await taskService.getAll(params)
    } catch (e) {
      setError(e)
    } finally {
      loading.value = false
    }
  }

  const fetchTask = async (id: number) => {
    // Obtener los detalles de una tarea específica
    loading.value = true
    error.value = null
    try {
      currentTask.value = await taskService.getById(id)
    } catch (e) {
      setError(e)
      currentTask.value = null
    } finally {
      loading.value = false
    }
  }

  const createTask = async (data: CreateTaskData) => {
    // Crear una nueva tarea
    loading.value = true
    error.value = null
    try {
      const task = await taskService.create(data)
      tasks.value.unshift(task)
      return task
    } catch (e) {
      setError(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateTask = async (id: number, data: UpdateTaskData) => {
    // Actualizar una tarea existente
    loading.value = true
    error.value = null
    try {
      const updated = await taskService.update(id, data)
      // Actualizar en la lista
      const idx = tasks.value.findIndex((t) => t.id === id)
      if (idx !== -1) tasks.value[idx] = { ...tasks.value[idx], ...updated }
      // Actualizar currentTask si corresponde
      if (currentTask.value?.id === id) currentTask.value = { ...currentTask.value, ...updated }
      return updated
    } catch (e) {
      setError(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteTask = async (id: number) => {
    // Eliminar una tarea
    loading.value = true
    error.value = null
    try {
      await taskService.delete(id)
      tasks.value = tasks.value.filter((t) => t.id !== id)
      if (currentTask.value?.id === id) currentTask.value = null
    } catch (e) {
      setError(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const setFilters = (newFilters: typeof filters.value) => {
    // Establecer los filtros activos y recargar la lista de tareas
    filters.value = newFilters
    fetchTasks()
  }

  // ---------- Actions : SubTasks ----------

  const fetchSubtasks = async (taskId: number) => {
    // Obtener las subtareas de una tarea específica
    error.value = null
    try {
      const subtasks = await subtaskService.getAll(taskId)
      // Si currentTask es la tarea correspondiente, actualizamos las subtareas inline
      if (currentTask.value?.id === taskId) {
        currentTask.value = { ...currentTask.value, subtasks }
      }
      return subtasks
    } catch (e) {
      setError(e)
      throw e
    }
  }

  const createSubtask = async (taskId: number, data: CreateSubTaskData) => {
    // Crear una nueva subtarea para una tarea específica
    error.value = null
    try {
      const subtask = await subtaskService.create(taskId, data)
      if (currentTask.value?.id === taskId) {
        currentTask.value = {
          ...currentTask.value,
          subtasks: [...(currentTask.value.subtasks ?? []), subtask],
        }
      }
      return subtask
    } catch (e) {
      setError(e)
      throw e
    }
  }

  const updateSubtask = async (taskId: number, subtaskId: number, data: UpdateSubTaskData) => {
    // Actualizar una subtarea existente
    error.value = null
    try {
      const updated = await subtaskService.update(taskId, subtaskId, data)
      if (currentTask.value?.id === taskId) {
        currentTask.value = {
          ...currentTask.value,
          subtasks: currentTask.value.subtasks.map((s) => (s.id === subtaskId ? updated : s)),
        }
      }
      return updated
    } catch (e) {
      setError(e)
      throw e
    }
  }

  const deleteSubtask = async (taskId: number, subtaskId: number) => {
    // Eliminar una subtarea
    error.value = null
    try {
      await subtaskService.delete(taskId, subtaskId)
      if (currentTask.value?.id === taskId) {
        currentTask.value = {
          ...currentTask.value,
          subtasks: currentTask.value.subtasks.filter((s) => s.id !== subtaskId),
        }
      }
    } catch (e) {
      setError(e)
      throw e
    }
  }

  const reorderSubtasks = async (taskId: number, items: ReorderItem[]) => {
    // Reordenar las subtareas de una tarea específica
    error.value = null
    try {
      const subtasks = await subtaskService.reorder(taskId, items)
      if (currentTask.value?.id === taskId) {
        currentTask.value = { ...currentTask.value, subtasks }
      }
      return subtasks
    } catch (e) {
      setError(e)
      throw e
    }
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
    fetchSubtasks,
    createSubtask,
    updateSubtask,
    deleteSubtask,
    reorderSubtasks,
  }
})
