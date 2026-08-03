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
  const tasks = ref<Task[]>([])
  const currentTask = ref<Task | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const filters = ref<{ search?: string; priority?: string; completed?: string }>({})

  // ---------- Getters ----------
  const pendingCount = computed(() => tasks.value.filter((t) => !t.completed).length)
  const completedCount = computed(() => tasks.value.filter((t) => t.completed).length)

  const setError = (e: unknown) => {
    error.value = e instanceof Error ? e.message : 'Error desconocido'
  }

  // ---------- Actions : Tasks ----------

  const fetchTasks = async () => {
    loading.value = true
    error.value = null
    try {
      const params: Record<string, string> = {}
      if (filters.value.search) params.search = filters.value.search
      if (filters.value.priority) params.priority = filters.value.priority
      if (filters.value.completed) params.completed = filters.value.completed
      const result = await taskService.getAll(params)
      tasks.value = Array.isArray(result)
        ? result.map((t) => ({ ...t, subtasks: t.subtasks ?? [] }))
        : []
    } catch (e) {
      setError(e)
    } finally {
      loading.value = false
    }
  }

  const fetchTask = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const task = await taskService.getById(id)
      currentTask.value = { ...task, subtasks: task.subtasks ?? [] }
    } catch (e) {
      setError(e)
      currentTask.value = null
    } finally {
      loading.value = false
    }
  }

  const createTask = async (data: CreateTaskData) => {
    loading.value = true
    error.value = null
    try {
      const task = await taskService.create(data)
      tasks.value.unshift({ ...task, subtasks: task.subtasks ?? [] }) // ← fix
      return task
    } catch (e) {
      setError(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateTask = async (id: number, data: UpdateTaskData) => {
    loading.value = true
    error.value = null
    try {
      const updated = await taskService.update(id, data)
      const idx = tasks.value.findIndex((t) => t.id === id)
      const existing = idx !== -1 ? tasks.value[idx] : null
      const merged = {
        ...existing,
        ...updated,
        subtasks: updated.subtasks ?? existing?.subtasks ?? [], // ← fix
      }
      if (idx !== -1) tasks.value[idx] = merged
      if (currentTask.value?.id === id) currentTask.value = { ...currentTask.value, ...merged }
      return updated
    } catch (e) {
      setError(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteTask = async (id: number) => {
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
    filters.value = newFilters
    fetchTasks()
  }

  // ---------- Actions : SubTasks ----------

  const fetchSubtasks = async (taskId: number) => {
    error.value = null
    try {
      const subtasks = await subtaskService.getAll(taskId)
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
