<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTasksStore } from '@/stores/tasks'
import { useToast } from '@/composables/useToast'
import { storeToRefs } from 'pinia'
import TaskForm from '@/components/tasks/TaskForm.vue'
import { formatDate, priorityColor } from '@/utils/validators'
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Check,
  CalendarDays,
  Flag,
  Clock,
  CheckCircle2,
  Circle,
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const tasksStore = useTasksStore()
const toast = useToast()

const { currentTask, loading } = storeToRefs(tasksStore)

const showEditForm = ref(false)

// Carga la tarea al montar
onMounted(async () => {
  const id = Number(route.params.id)
  if (!id) {
    router.push('/tasks')
    return
  }
  await tasksStore.fetchTask(id)
  if (!currentTask.value) router.push('/tasks')
})

const priorityLabel: Record<string, string> = { LOW: 'Baja', MEDIUM: 'Media', HIGH: 'Alta' }

const statusLabel = computed(() => (currentTask.value?.completed ? 'Completada' : 'Pendiente'))

// Toggle completada
const handleToggle = async () => {
  if (!currentTask.value) return
  try {
    await tasksStore.updateTask(currentTask.value.id, {
      completed: !currentTask.value.completed,
    })
    toast.success(currentTask.value.completed ? 'Marcada como pendiente' : 'Tarea completada ✓')
  } catch {
    toast.error('Error al actualizar la tarea')
  }
}

// Guardar edición
const handleSubmit = async (data: {
  title: string
  description: string
  priority: string
  dueDate: string
}) => {
  if (!currentTask.value) return
  try {
    await tasksStore.updateTask(currentTask.value.id, {
      ...data,
      priority: data.priority as 'LOW' | 'MEDIUM' | 'HIGH',
    })
    toast.success('Tarea actualizada ✓')
    showEditForm.value = false
  } catch {
    toast.error('Error al actualizar')
  }
}

// Eliminar
const handleDelete = async () => {
  if (!currentTask.value) return
  if (!confirm('¿Eliminás esta tarea?')) return
  try {
    await tasksStore.deleteTask(currentTask.value.id)
    toast.success('Tarea eliminada')
    router.push('/tasks')
  } catch {
    toast.error('Error al eliminar')
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-5">
    <!-- Back button -->
    <button
      @click="router.push('/tasks')"
      class="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors touch-manipulation"
    >
      <ArrowLeft class="w-4 h-4" />
      Volver a tareas
    </button>

    <!-- Loading skeleton -->
    <div v-if="loading && !currentTask" class="space-y-4">
      <div class="h-8 bg-white/5 rounded-xl animate-pulse w-2/3" />
      <div class="h-32 bg-white/5 rounded-2xl animate-pulse" />
    </div>

    <template v-else-if="currentTask">
      <!-- Card principal -->
      <div class="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 space-y-5">
        <!-- Header: título + acciones -->
        <div class="flex items-start gap-3">
          <!-- Toggle completada -->
          <button
            @click="handleToggle"
            :class="[
              'mt-0.5 w-6 h-6 min-w-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all touch-manipulation',
              currentTask.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-white/30 hover:border-green-400',
            ]"
          >
            <Check v-if="currentTask.completed" class="w-3.5 h-3.5 stroke-3" />
          </button>

          <!-- Título -->
          <h2
            :class="[
              'flex-1 text-lg sm:text-xl font-bold text-white leading-tight',
              currentTask.completed && 'line-through opacity-50',
            ]"
          >
            {{ currentTask.title }}
          </h2>

          <!-- Editar / Eliminar -->
          <div class="flex gap-1 shrink-0">
            <button
              @click="showEditForm = !showEditForm"
              :class="[
                'p-2 rounded-lg transition-all touch-manipulation',
                showEditForm
                  ? 'text-blue-400 bg-blue-400/10'
                  : 'text-white/40 hover:text-white hover:bg-white/10',
              ]"
              aria-label="Editar"
            >
              <Pencil class="w-4 h-4" />
            </button>
            <button
              @click="handleDelete"
              class="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all touch-manipulation"
              aria-label="Eliminar"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Descripción -->
        <p v-if="currentTask.description" class="text-sm text-white/60 leading-relaxed">
          {{ currentTask.description }}
        </p>
        <p v-else class="text-sm text-white/25 italic">Sin descripción</p>

        <!-- Meta pills -->
        <div class="flex flex-wrap gap-2">
          <!-- Estado -->
          <div
            :class="[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
              currentTask.completed
                ? 'bg-green-400/10 text-green-400'
                : 'bg-yellow-400/10 text-yellow-400',
            ]"
          >
            <component :is="currentTask.completed ? CheckCircle2 : Circle" class="w-3.5 h-3.5" />
            {{ statusLabel }}
          </div>

          <!-- Prioridad -->
          <div
            :class="[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
              priorityColor(currentTask.priority),
            ]"
          >
            <Flag class="w-3.5 h-3.5" />
            Prioridad {{ priorityLabel[currentTask.priority] }}
          </div>

          <!-- Fecha límite -->
          <div
            v-if="currentTask.dueDate"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 text-white/50"
          >
            <CalendarDays class="w-3.5 h-3.5" />
            {{ formatDate(currentTask.dueDate) }}
          </div>

          <!-- Creada -->
          <div
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 text-white/30"
          >
            <Clock class="w-3.5 h-3.5" />
            Creada {{ formatDate(currentTask.createdAt) }}
          </div>
        </div>

        <!-- Acción rápida: marcar / desmarcar (botón grande, cómodo en mobile) -->
        <button
          @click="handleToggle"
          :class="[
            'w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all touch-manipulation',
            currentTask.completed
              ? 'bg-white/5 hover:bg-white/10 text-white/60'
              : 'bg-green-500/15 hover:bg-green-500/25 text-green-400 border border-green-500/20',
          ]"
        >
          <component :is="currentTask.completed ? Circle : CheckCircle2" class="w-4 h-4" />
          {{ currentTask.completed ? 'Marcar como pendiente' : 'Marcar como completada' }}
        </button>
      </div>

      <!-- Formulario de edición (expandible) -->
      <transition name="slide">
        <div v-if="showEditForm" class="bg-gray-900 border border-white/10 rounded-2xl p-5 sm:p-6">
          <h3 class="text-sm font-semibold text-white mb-4">Editar tarea</h3>
          <TaskForm
            :task="currentTask"
            :loading="loading"
            @submit="handleSubmit"
            @cancel="showEditForm = false"
          />
        </div>
      </transition>
    </template>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
