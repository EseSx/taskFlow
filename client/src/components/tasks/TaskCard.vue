<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Task } from '@/services/taskService'
import { formatDate, priorityColor } from '@/utils/validators'
import { Check, Pencil, Trash2, CalendarDays, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{ task: Task }>()
const emit = defineEmits<{
  toggle: [id: number]
  delete: [id: number]
  edit: [task: Task]
}>()

const router = useRouter()

const priorityLabel: Record<string, string> = { LOW: 'Baja', MEDIUM: 'Media', HIGH: 'Alta' }

const goToDetail = () => router.push(`/tasks/${props.task.id}`)
</script>

<template>
  <div
    :class="[
      'group flex items-start gap-3 p-4 rounded-xl border transition-all duration-200',
      task.completed
        ? 'bg-white/3 border-white/5 opacity-60'
        : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/8',
    ]"
  >
    <!-- Checkbox -->
    <button
      @click.stop="emit('toggle', task.id)"
      :class="[
        'mt-0.5 w-5 h-5 min-w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all touch-manipulation',
        task.completed
          ? 'bg-green-500 border-green-500 text-white'
          : 'border-white/30 hover:border-green-400 active:border-green-400',
      ]"
      aria-label="Marcar como completada"
    >
      <Check v-if="task.completed" class="w-3 h-3 stroke-3" />
    </button>

    <!-- Contenido (clickeable para ir al detalle) -->
    <div class="flex-1 min-w-0 cursor-pointer" @click="goToDetail">
      <p
        :class="[
          'text-sm font-medium text-white leading-5',
          task.completed && 'line-through opacity-50',
        ]"
      >
        {{ task.title }}
      </p>
      <p v-if="task.description" class="text-xs text-white/40 mt-0.5 line-clamp-1 sm:line-clamp-2">
        {{ task.description }}
      </p>
      <div class="flex items-center gap-2 mt-2 flex-wrap">
        <span
          :class="['text-xs px-2 py-0.5 rounded-full font-medium', priorityColor(task.priority)]"
        >
          {{ priorityLabel[task.priority] }}
        </span>
        <span v-if="task.dueDate" class="flex items-center gap-1 text-xs text-white/30">
          <CalendarDays class="w-3 h-3" />{{ formatDate(task.dueDate) }}
        </span>
      </div>
    </div>

    <!-- Acciones:
         - Mobile: siempre visibles
         - Desktop: aparecen en hover -->
    <div
      class="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0"
    >
      <button
        @click.stop="emit('edit', task)"
        class="p-2 sm:p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 active:bg-white/15 transition-all touch-manipulation"
        aria-label="Editar"
      >
        <Pencil class="w-4 h-4 sm:w-3.5 sm:h-3.5" />
      </button>
      <button
        @click.stop="emit('delete', task.id)"
        class="p-2 sm:p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 active:bg-red-400/15 transition-all touch-manipulation"
        aria-label="Eliminar"
      >
        <Trash2 class="w-4 h-4 sm:w-3.5 sm:h-3.5" />
      </button>
      <!-- Flecha para ir al detalle (solo mobile) -->
      <button
        @click.stop="goToDetail"
        class="p-2 rounded-lg text-white/20 sm:hidden touch-manipulation"
        aria-label="Ver detalle"
      >
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
