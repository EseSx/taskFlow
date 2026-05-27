<script setup lang="ts">
// ── Componente TaskCard ───────────────────────────────────────────
// Muestra una tarea individual en la lista
// Emite eventos al padre para toggle y delete sin manejar la lógica acá

import type { Task } from '@/services/taskService'
import { formatDate, priorityColor } from '@/utils/validators'

// Props que recibe el componente
const props = defineProps<{
  task: Task
}>()

// Eventos que emite al componente padre
const emit = defineEmits<{
  toggle: [id: number]         // Cambiar estado completado
  delete: [id: number]         // Eliminar tarea
  edit:   [task: Task]         // Abrir formulario de edición
}>()

// Texto legible de la prioridad
const priorityLabel: Record<string, string> = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
}
</script>

<template>
  <div
    :class="[
      'group flex items-start gap-3 p-4 rounded-xl border transition-all duration-200',
      task.completed
        ? 'bg-white/3 border-white/5 opacity-60'
        : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/8'
    ]"
  >
    <!-- Checkbox para marcar como completada -->
    <button
      @click="emit('toggle', task.id)"
      :class="[
        'mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
        task.completed
          ? 'bg-green-500 border-green-500 text-white'
          : 'border-white/30 hover:border-green-400'
      ]"
      aria-label="Marcar como completada"
    >
      <span v-if="task.completed" class="text-xs font-bold">✓</span>
    </button>

    <!-- Contenido de la tarea -->
    <div class="flex-1 min-w-0">
      <!-- Título -->
      <p :class="['text-sm font-medium text-white leading-5', task.completed && 'line-through opacity-50']">
        {{ task.title }}
      </p>

      <!-- Descripción (si existe) -->
      <p v-if="task.description" class="text-xs text-white/40 mt-1 line-clamp-2">
        {{ task.description }}
      </p>

      <!-- Meta: prioridad y fecha -->
      <div class="flex items-center gap-2 mt-2 flex-wrap">
        <!-- Badge de prioridad -->
        <span :class="['text-xs px-2 py-0.5 rounded-full font-medium', priorityColor(task.priority)]">
          {{ priorityLabel[task.priority] }}
        </span>

        <!-- Fecha límite -->
        <span v-if="task.dueDate" class="text-xs text-white/30">
          📅 {{ formatDate(task.dueDate) }}
        </span>
      </div>
    </div>

    <!-- Acciones (visibles al hacer hover) -->
    <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
      <!-- Botón editar -->
      <button
        @click="emit('edit', task)"
        class="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
        aria-label="Editar tarea"
      >
        ✏️
      </button>

      <!-- Botón eliminar -->
      <button
        @click="emit('delete', task.id)"
        class="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all"
        aria-label="Eliminar tarea"
      >
        🗑️
      </button>
    </div>
  </div>
</template>