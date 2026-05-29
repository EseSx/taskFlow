<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTasksStore } from '@/stores/tasks'
import { storeToRefs } from 'pinia'

const router = useRouter()
const authStore = useAuthStore()
const tasksStore = useTasksStore()

const { tasks, loading } = storeToRefs(tasksStore)

onMounted(() => {
  tasksStore.fetchTasks()
})

// Stats calculadas
const totalTasks = computed(() => tasks.value.length)
const completedTasks = computed(() => tasks.value.filter((t) => t.completed).length)
const pendingTasks = computed(() => tasks.value.filter((t) => !t.completed).length)
const highPriority = computed(
  () => tasks.value.filter((t) => t.priority === 'HIGH' && !t.completed).length,
)

const completionRate = computed(() => {
  if (!totalTasks.value) return 0
  return Math.round((completedTasks.value / totalTasks.value) * 100)
})

// Tareas recientes (últimas 5 pendientes)
const recentTasks = computed(() => tasks.value.filter((t) => !t.completed).slice(0, 5))

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 18) return 'Buenas tardes'
  return 'Buenas noches'
})

const priorityColor: Record<string, string> = {
  LOW: 'text-blue-400 bg-blue-400/10',
  MEDIUM: 'text-yellow-400 bg-yellow-400/10',
  HIGH: 'text-red-400 bg-red-400/10',
}
const priorityLabel: Record<string, string> = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
}
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-8 cursor-default">
    <!-- Greeting -->
    <div>
      <h2 class="text-2xl font-bold text-white">
        {{ greeting }}, {{ authStore.user?.name?.split(' ')[0] ?? 'Usuario' }}
      </h2>
      <p class="text-white/40 text-sm mt-1">Aquí está el resumen de tus tareas.</p>
    </div>

    <!-- Stats grid -->
    <div v-if="!loading" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total -->
      <div class="bg-white/5 border border-white/8 rounded-2xl p-5">
        <div class="flex items-center justify-between mb-3">
          <span class="text-white/40 text-xs font-medium uppercase tracking-wider">Total</span>
          <div class="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 4h12M2 8h12M2 12h8"
                stroke="white"
                stroke-opacity=".5"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-white">{{ totalTasks }}</p>
        <p class="text-white/30 text-xs mt-1">tareas en total</p>
      </div>

      <!-- Pendientes -->
      <div class="bg-white/5 border border-white/8 rounded-2xl p-5">
        <div class="flex items-center justify-between mb-3">
          <span class="text-white/40 text-xs font-medium uppercase tracking-wider">Pendientes</span>
          <div class="w-8 h-8 rounded-xl bg-yellow-400/10 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="#facc15" stroke-opacity=".8" stroke-width="1.5" />
              <path
                d="M8 5v3l2 2"
                stroke="#facc15"
                stroke-opacity=".8"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-white">{{ pendingTasks }}</p>
        <p class="text-white/30 text-xs mt-1">por completar</p>
      </div>

      <!-- Completadas -->
      <div class="bg-white/5 border border-white/8 rounded-2xl p-5">
        <div class="flex items-center justify-between mb-3">
          <span class="text-white/40 text-xs font-medium uppercase tracking-wider">Hechas</span>
          <div class="w-8 h-8 rounded-xl bg-green-400/10 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="#4ade80" stroke-opacity=".8" stroke-width="1.5" />
              <path
                d="M5.5 8l2 2 3-3"
                stroke="#4ade80"
                stroke-opacity=".8"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-white">{{ completedTasks }}</p>
        <p class="text-white/30 text-xs mt-1">completadas</p>
      </div>

      <!-- Alta prioridad -->
      <div class="bg-white/5 border border-white/8 rounded-2xl p-5">
        <div class="flex items-center justify-between mb-3">
          <span class="text-white/40 text-xs font-medium uppercase tracking-wider">Urgentes</span>
          <div class="w-8 h-8 rounded-xl bg-red-400/10 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 2l6 12H2L8 2z"
                stroke="#f87171"
                stroke-opacity=".8"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
              <path
                d="M8 7v3M8 11.5v.5"
                stroke="#f87171"
                stroke-opacity=".8"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-white">{{ highPriority }}</p>
        <p class="text-white/30 text-xs mt-1">alta prioridad</p>
      </div>
    </div>

    <!-- Skeleton loading -->
    <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="h-32 bg-white/5 rounded-2xl animate-pulse" />
    </div>

    <!-- Progress bar -->
    <div v-if="totalTasks > 0" class="bg-white/5 border border-white/8 rounded-2xl p-5">
      <div class="flex items-center justify-between mb-3">
        <span class="text-white text-sm font-medium">Progreso general</span>
        <span class="text-white/60 text-sm">{{ completionRate }}%</span>
      </div>
      <div class="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          class="h-full bg-blue-500 rounded-full transition-all duration-700"
          :style="{ width: completionRate + '%' }"
        />
      </div>
      <p class="text-white/30 text-xs mt-2">
        {{ completedTasks }} de {{ totalTasks }} tareas completadas
      </p>
    </div>

    <!-- Tareas recientes -->
    <div v-if="recentTasks.length > 0">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-white font-semibold text-sm">Tareas pendientes recientes</h3>
        <router-link
          to="/tasks"
          class="text-blue-400 hover:text-blue-300 text-xs transition-colors"
        >
          Ver todas →
        </router-link>
      </div>

      <div class="space-y-2">
        <div
          v-for="task in recentTasks"
          :key="task.id"
          class="flex items-center gap-3 p-4 bg-white/3 border border-white/5 rounded-xl hover:bg-white/5 transition-all group"
        >
          <!-- Indicador prioridad -->
          <div
            :class="[
              'w-2 h-2 rounded-full shrink-0',
              task.priority === 'HIGH'
                ? 'bg-red-400'
                : task.priority === 'MEDIUM'
                  ? 'bg-yellow-400'
                  : 'bg-blue-400',
            ]"
          />

          <p class="flex-1 text-sm text-white/80 truncate">{{ task.title }}</p>

          <span :class="['text-xs px-2 py-0.5 rounded-full', priorityColor[task.priority]]">
            {{ priorityLabel[task.priority] }}
          </span>
        </div>
      </div>
    </div>

    <!-- Empty state cuando no hay tareas -->
    <div
      v-else-if="!loading && totalTasks === 0"
      class="text-center py-16 bg-white/3 border border-white/5 rounded-2xl"
    >
      <p class="text-4xl mb-4">✨</p>
      <p class="text-white font-medium mb-1">Todo listo para empezar</p>
      <p class="text-white/40 text-sm mb-5">Creá tu primera tarea para comenzar</p>
      <router-link
        to="/tasks"
        class="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-all"
      >
        + Nueva tarea
      </router-link>
    </div>
  </div>
</template>
