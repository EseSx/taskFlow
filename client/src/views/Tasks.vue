<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useToast } from '@/composables/useToast'
import { storeToRefs } from 'pinia'
import TaskCard from '@/components/tasks/TaskCard.vue'
import TaskForm from '@/components/tasks/TaskForm.vue'
import type { Task, CreateTaskData } from '@/services/taskService'

const tasksStore = useTasksStore()
const toast = useToast()

const { tasks, loading, error, pendingCount, completedCount } = storeToRefs(tasksStore)

const showModal = ref(false)
const editingTask = ref<Task | null>(null)
const searchQuery = ref('')
const filterStatus = ref('')
const filterPriority = ref('')

onMounted(() => tasksStore.fetchTasks())

watch([searchQuery, filterStatus, filterPriority], () => {
  tasksStore.setFilters({
    search: searchQuery.value || undefined,
    completed: filterStatus.value || undefined,
    priority: filterPriority.value || undefined,
  })
})

const openCreateModal = () => {
  editingTask.value = null
  showModal.value = true
}
const openEditModal = (task: Task) => {
  editingTask.value = task
  showModal.value = true
}
const closeModal = () => {
  showModal.value = false
  editingTask.value = null
}

const handleSubmit = async (data: {
  title: string
  description: string
  priority: string
  dueDate: string
}) => {
  const taskData: CreateTaskData = { ...data, priority: data.priority as 'LOW' | 'MEDIUM' | 'HIGH' }
  try {
    if (editingTask.value) {
      await tasksStore.updateTask(editingTask.value.id, taskData)
      toast.success('Tarea actualizada ✓')
    } else {
      await tasksStore.createTask(taskData)
      toast.success('Tarea creada ✓')
    }
    closeModal()
  } catch {
    toast.error(error.value || 'Error al guardar la tarea')
  }
}

const handleToggle = async (id: number) => {
  const task = tasks.value.find((t) => t.id === id)
  if (!task) return
  try {
    await tasksStore.updateTask(id, { completed: !task.completed })
  } catch {
    toast.error('Error al actualizar la tarea')
  }
}

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
  <div class="max-w-3xl mx-auto space-y-6 cursor-default">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-white cursor-default">Mis Tareas</h2>
        <p class="text-white/40 text-sm mt-0.5">
          {{ pendingCount }} pendientes · {{ completedCount }} completadas
        </p>
      </div>
      <button
        @click="openCreateModal"
        class="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-all cursor-pointer"
      >
        <span class="text-lg leading-none">+</span>
        Nueva tarea
      </button>
    </div>

    <!-- Filtros -->
    <div class="flex flex-wrap gap-2">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar tareas..."
        class="flex-1 min-w-40 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-blue-400 transition-all"
      />
      <select
        v-model="filterStatus"
        class="bg-white/5 border border-white/10 rounded-lg px-3 pr-9 py-2 text-sm text-white/70 outline-none focus:outline-none focus:ring-0 focus:border-blue-400 focus:bg-white/10 transition-all appearance-none cursor-pointer *:bg-gray-900 *:text-white"
      >
        <option value="">Todas</option>
        <option value="false">Pendientes</option>
        <option value="true">Completadas</option>
      </select>
      <select
        v-model="filterPriority"
        class="bg-white/5 border border-white/10 rounded-lg px-3 pr-9 py-2 text-sm text-white/70 outline-none focus:outline-none focus:ring-0 focus:border-blue-400 focus:bg-white/10 transition-all appearance-none cursor-pointer *:bg-gray-900 *:text-white"
      >
        <option value="">Todas las prioridades</option>
        <option value="HIGH">Alta</option>
        <option value="MEDIUM">Media</option>
        <option value="LOW">Baja</option>
      </select>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="space-y-2">
      <div v-for="i in 4" :key="i" class="h-16 bg-white/5 rounded-xl animate-pulse" />
    </div>

    <!-- Empty state -->
    <div v-else-if="tasks.length === 0" class="text-center py-16">
      <p class="text-5xl mb-4">📝</p>
      <p class="text-white/60 text-sm">
        {{
          searchQuery || filterStatus || filterPriority
            ? 'No hay tareas que coincidan con los filtros'
            : 'No tenés tareas todavía. ¡Creá la primera!'
        }}
      </p>
    </div>

    <!-- Lista -->
    <div v-else class="space-y-2">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @toggle="handleToggle"
        @delete="handleDelete"
        @edit="openEditModal"
      />
    </div>

    <!-- Modal -->
    <transition name="fade">
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <div class="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
          <h2 class="text-lg font-semibold text-white mb-5">
            {{ editingTask ? 'Editar tarea' : 'Nueva tarea' }}
          </h2>
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  background-color: rgba(255, 255, 255, 0.05);

  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.45)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E");

  background-position: right 0.7rem center;
  background-repeat: no-repeat;
  background-size: 14px;

  border: 1px solid rgba(255, 255, 255, 0.08);
}

select:focus,
select:focus-visible,
select:active {
  outline: none !important;
  box-shadow: none !important;
}

select option {
  background-color: rgb(17 24 39);
  color: rgba(255, 255, 255, 0.9);
}
</style>
