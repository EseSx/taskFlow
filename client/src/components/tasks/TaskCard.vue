<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Task } from '@/services/taskService'
import { priorityColor } from '@/utils/validators'
import { Check, Pencil, Trash2, CalendarDays, ChevronRight, ListChecks } from 'lucide-vue-next'

const props = defineProps<{ task: Task }>()
const emit = defineEmits<{
  toggle: [id: number]
  delete: [id: number]
  edit: [task: Task]
}>()

const router = useRouter()

const priorityLabel: Record<string, string> = { LOW: 'Baja', MEDIUM: 'Media', HIGH: 'Alta' }

// ---------- Progreso de subtareas ----------
const subtasks = computed(() => props.task.subtasks ?? [])
const subTotal = computed(() => subtasks.value.length)
const subDone = computed(() => subtasks.value.filter((s) => s.completed).length)
const subPct = computed(() =>
  subTotal.value === 0 ? 0 : Math.round((subDone.value / subTotal.value) * 100),
)

const goToDetail = () => router.push(`/tasks/${props.task.id}`)

// Helper para formatear fecha corta
const formatDate = (d: string | null) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })
}
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
          : 'border-white/30 hover:border-green-400',
      ]"
      aria-label="Marcar como completada"
    >
      <Check v-if="task.completed" class="w-3 h-3 stroke-3" />
    </button>

    <!-- Contenido (clickeable para ir al detalle) -->
    <div class="flex-1 min-w-0 cursor-pointer" @click="goToDetail">
      <!-- Título -->
      <p
        :class="[
          'text-sm font-medium text-white leading-snug whitespace-normal wrap-break-word',
          task.completed && 'line-through opacity-50',
        ]"
      >
        {{ task.title }}
      </p>

      <!-- Descripción -->
      <p
        v-if="task.description"
        class="text-xs text-white/40 mt-0.5 line-clamp-1 whitespace-normal wrap-break-word"
      >
        {{ task.description }}
      </p>

      <!-- Meta: prioridad + fecha -->
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

      <!-- ── Progreso de subtareas (solo si existen) ──────────────────── -->
      <div v-if="subTotal > 0" class="mt-3 space-y-1">
        <div class="flex items-center justify-between">
          <span class="flex items-center gap-1 text-xs text-white/30">
            <ListChecks class="w-3 h-3" />
            {{ subDone }}/{{ subTotal }} subtareas
          </span>
          <span class="text-xs text-white/30">{{ subPct }}%</span>
        </div>
        <div class="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :class="subPct === 100 ? 'bg-green-500' : 'bg-blue-500'"
            :style="{ width: subPct + '%' }"
          />
        </div>
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
        class="p-2 sm:p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all touch-manipulation"
        aria-label="Editar"
      >
        <Pencil class="w-4 h-4 sm:w-3.5 sm:h-3.5" />
      </button>
      <button
        @click.stop="emit('delete', task.id)"
        class="p-2 sm:p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all touch-manipulation"
        aria-label="Eliminar"
      >
        <Trash2 class="w-4 h-4 sm:w-3.5 sm:h-3.5" />
      </button>
      <!-- Flecha al detalle (mobile) -->
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
