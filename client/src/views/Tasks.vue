<script setup lang="ts">
// ── Vista: Tasks ──────────────────────────────────────────────────
// Vista principal de gestión de tareas
// Incluye: listado, filtros, búsqueda, modal de creación/edición

import { ref, onMounted, watch } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useToast }      from '@/composables/useToast'
import { storeToRefs }   from 'pinia'
import TaskCard from '@/components/tasks/TaskCard.vue'
import TaskForm from '@/components/tasks/TaskForm.vue'
import type { Task } from '@/services/taskService'

const tasksStore = useTasksStore()
const toast      = useToast()

// Desestructuramos el store manteniendo la reactividad
const { tasks, loading, error, pendingCount, completedCount } = storeToRefs(tasksStore)

// ── Estado local ──────────────────────────────────────────────────
const showModal   = ref(false)               // Controla la visibilidad del modal
const editingTask = ref<Task | null>(null)   // null = modo creación, Task = modo edición
const searchQuery = ref('')                  // Texto de búsqueda
const filterStatus   = ref('')              // Filtro: '' | 'true' | 'false'
const filterPriority = ref('')              // Filtro: '' | 'LOW' | 'MEDIUM' | 'HIGH'

// ── Carga inicial ─────────────────────────────────────────────────
onMounted(() => {
  tasksStore.fetchTasks()
})

// Recarga las tareas cuando cambia algún filtro (con debounce implícito del watch)
watch([searchQuery, filterStatus, filterPriority], () => {
  tasksStore.setFilters({
    search:    searchQuery.value || undefined,
    completed: filterStatus.value || undefined,
    priority:  filterPriority.value || undefined,
  })
})

// ── Handlers ──────────────────────────────────────────────────────

// Abre el modal para crear una nueva tarea
const openCreateModal = () => {
  editingTask.value = null
  showModal.value = true
}

// Abre el modal para editar una tarea existente
const openEditModal = (task: Task) => {
  editingTask.value = task
  showModal.value = true
}

// Cierra el modal y limpia el estado
const closeModal = () => {
  showModal.value = false
  editingTask.value = null
}

// Maneja el submit del formulario (crea o actualiza según el modo)
import type { CreateTaskData } from '@/services/taskService'

// Casteamos el priority de string a los valores válidos del tipo
const handleSubmit = async (data: { title: string; description: string; priority: string; dueDate: string }) => {
  const taskData: CreateTaskData = {
    ...data,
    priority: data.priority as 'LOW' | 'MEDIUM' | 'HIGH',
  }
  try {
    if (editingTask.value) {
      // Modo edición: actualizamos la tarea existente
      await tasksStore.updateTask(editingTask.value.id, taskData)
      toast.success('Tarea actualizada ✓')
    } else {
      // Modo creación: creamos una nueva tarea
      await tasksStore.createTask(taskData)
      toast.success('Tarea creada ✓')
    }
    closeModal()
  } catch {
    // El error ya está en el store, el toast muestra el mensaje
    toast.error(error.value || 'Error al guardar la tarea')
  }
}

// Cambia el estado completado de una tarea
const handleToggle = async (id: number) => {
  const task = tasks.value.find((t) => t.id === id)
  if (!task) return
  try {
    await tasksStore.updateTask(id, { completed: !task.completed })
  } catch {
    toast.error('Error al actualizar la tarea')
  }
}

// Elimina una tarea con confirmación
const handleDelete = async (id: number) => {
  if (!confirm('¿Estás seguro de que querés eliminar esta tarea?')) return
  try {
    await tasksStore.deleteTask(id)
    toast.success('Tarea eliminada')
  } catch {
    toast.error('Error al eliminar la tarea')
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">

    <!-- Encabezado con stats y botón crear -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">Mis Tareas</h1>
        <p class="text-sm text-white/40 mt-1">
          {{ pendingCount }} pendientes · {{ completedCount }} completadas
        </p>
      </div>

      <button
        @click="openCreateModal"
        class="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-all"
      >
        <span class="text-lg leading-none">+</span>
        Nueva tarea
      </button>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="flex flex-wrap gap-3">
      <!-- Búsqueda por texto -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar tareas..."
        class="flex-1 min-w-48 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-blue-400 transition-all"
      />

      <!-- Filtro por estado -->
      <select
        v-model="filterStatus"
        class="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-400 transition-all"
      >
        <option value="">Todas</option>
        <option value="false">Pendientes</option>
        <option value="true">Completadas</option>
      </select>

      <!-- Filtro por prioridad -->
      <select
        v-model="filterPriority"
        class="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-400 transition-all"
      >
        <option value="">Todas las prioridades</option>
        <option value="HIGH">Alta</option>
        <option value="MEDIUM">Media</option>
        <option value="LOW">Baja</option>
      </select>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex flex-col gap-2">
      <!-- Skeleton loading: 4 placeholders animados -->
      <div
        v-for="i in 4"
        :key="i"
        class="h-16 bg-white/5 rounded-xl animate-pulse"
      />
    </div>

    <!-- Empty state: no hay tareas -->
    <div
      v-else-if="tasks.length === 0"
      class="text-center py-16"
    >
      <p class="text-5xl mb-4">📝</p>
      <p class="text-white/60 text-sm">
        {{ searchQuery || filterStatus || filterPriority
          ? 'No hay tareas que coincidan con los filtros'
          : 'No tenés tareas todavía. ¡Creá la primera!' }}
      </p>
    </div>

    <!-- Lista de tareas -->
    <div v-else class="flex flex-col gap-2">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @toggle="handleToggle"
        @delete="handleDelete"
        @edit="openEditModal"
      />
    </div>

    <!-- Modal de creación/edición -->
    <transition name="fade">
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <div class="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
          <!-- Título del modal -->
          <h2 class="text-lg font-semibold text-white mb-5">
            {{ editingTask ? 'Editar tarea' : 'Nueva tarea' }}
          </h2>

          <!-- Formulario -->
          <TaskForm
            :task="editingTask"
            :loading="loading"
            @submit="handleSubmit"
            @cancel="closeModal"
          />
        </div>
      </div>
    </transition>

  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
</style>