<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useToast } from '@/composables/useToast'
import type { SubTask } from '@/services/taskService'
import { Check, Trash2, Plus, GripVertical, Pencil, X } from 'lucide-vue-next'

// Definir las propiedades que el componente espera recibir
const props = defineProps<{
  taskId: number
  subtasks: SubTask[]
}>()

const tasksStore = useTasksStore()
const toast = useToast()

// ---------- Progreso ----------
const total = computed(() => props.subtasks.length)
const completed = computed(() => props.subtasks.filter((s) => s.completed).length)
const progress = computed(() =>
  total.value === 0 ? 0 : Math.round((completed.value / total.value) * 100),
)

// ---------- Nueva Subtarea ----------
const newTitle = ref('')
const adding = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

const startAdding = () => {
  adding.value = true
  setTimeout(() => inputRef.value?.focus(), 50)
}

const cancelAdding = () => {
  adding.value = false
  newTitle.value = ''
}

const submitNew = async () => {
  const title = newTitle.value.trim()
  if (!title) return cancelAdding()
  try {
    await tasksStore.createSubtask(props.taskId, { title })
    newTitle.value = ''
    // Mantener el input abierto para agregar más
    setTimeout(() => inputRef.value?.focus(), 50)
  } catch {
    toast.error('Error al crear la subtarea')
  }
}

// ---------- Toggle completada ----------
const toggleSubtask = async (subtask: SubTask) => {
  try {
    await tasksStore.updateSubtask(props.taskId, subtask.id, { completed: !subtask.completed })
  } catch {
    toast.error('Error al actualizar la subtarea')
  }
}

// ---------- Edición inline ----------
const editingId = ref<number | null>(null)
const editingTitle = ref('')

const startEdit = (subtask: SubTask) => {
  editingId.value = subtask.id
  editingTitle.value = subtask.title
}

const submitEdit = async (subtask: SubTask) => {
  const title = editingTitle.value.trim()
  if (!title || title === subtask.title) {
    editingId.value = null
    return
  }
  try {
    await tasksStore.updateSubtask(props.taskId, subtask.id, { title })
  } catch {
    toast.error('Error al editar la subtarea')
  } finally {
    editingId.value = null
  }
}

const cancelEdit = () => {
  editingId.value = null
}

// ---------- Eliminar ----------
const handleDelete = async (subtaskId: number) => {
  try {
    await tasksStore.deleteSubtask(props.taskId, subtaskId)
  } catch {
    toast.error('Error al eliminar la subtarea')
  }
}
</script>

<template>
  <div class="space-y-3">
    <!-- Header con progreso -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <h3 class="text-sm font-semibold text-white">Subtareas</h3>
        <span class="text-xs text-white/30">{{ completed }} / {{ total }}</span>
      </div>
      <span class="text-xs text-white/40">{{ progress }}%</span>
    </div>

    <!-- Barra de progreso -->
    <div v-if="total > 0" class="h-1.5 bg-white/10 rounded-full overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-500"
        :class="progress === 100 ? 'bg-green-500' : 'bg-blue-500'"
        :style="{ width: progress + '%' }"
      />
    </div>

    <!-- Lista de subtareas -->
    <ul class="space-y-1">
      <li
        v-for="subtask in subtasks"
        :key="subtask.id"
        class="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
      >
        <!-- Grip (visual, sin drag implementado) -->
        <GripVertical class="w-3.5 h-3.5 text-white/15 shrink-0 cursor-grab hidden sm:block" />

        <!-- Checkbox -->
        <button
          @click="toggleSubtask(subtask)"
          :class="[
            'w-4.5 h-4.5 min-w-[1.1rem] rounded border-2 flex items-center justify-center transition-all touch-manipulation shrink-0',
            subtask.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-white/30 hover:border-green-400',
          ]"
        >
          <Check v-if="subtask.completed" class="w-2.5 h-2.5 stroke-3" />
        </button>

        <!-- Título / input de edición -->
        <div class="flex-1 min-w-0">
          <input
            v-if="editingId === subtask.id"
            v-model="editingTitle"
            class="w-full bg-transparent text-sm text-white outline-none border-b border-blue-400 pb-0.5"
            @keyup.enter="submitEdit(subtask)"
            @keyup.escape="cancelEdit"
            @blur="submitEdit(subtask)"
            autofocus
          />
          <span
            v-else
            :class="[
              'text-sm leading-5 block truncate cursor-default',
              subtask.completed ? 'line-through text-white/30' : 'text-white/80',
            ]"
            @dblclick="startEdit(subtask)"
          >
            {{ subtask.title }}
          </span>
        </div>

        <!-- Acciones: visible en hover (desktop) o siempre (mobile) -->
        <div
          class="flex gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0"
        >
          <button
            @click="startEdit(subtask)"
            class="p-1.5 rounded text-white/30 hover:text-white hover:bg-white/10 transition-all touch-manipulation"
            aria-label="Editar"
          >
            <Pencil class="w-3 h-3" />
          </button>
          <button
            @click="handleDelete(subtask.id)"
            class="p-1.5 rounded text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all touch-manipulation"
            aria-label="Eliminar"
          >
            <Trash2 class="w-3 h-3" />
          </button>
        </div>
      </li>
    </ul>

    <!-- Input nueva subtarea -->
    <div
      v-if="adding"
      class="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-blue-500/30"
    >
      <div class="w-4.5 h-4.5 min-w-[1.1rem] rounded border-2 border-white/20 shrink-0" />
      <input
        ref="inputRef"
        v-model="newTitle"
        placeholder="Título de la subtarea..."
        class="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
        @keyup.enter="submitNew"
        @keyup.escape="cancelAdding"
      />
      <button
        @click="submitNew"
        class="p-1 rounded text-blue-400 hover:bg-blue-400/10 transition-all touch-manipulation"
      >
        <Check class="w-3.5 h-3.5" />
      </button>
      <button
        @click="cancelAdding"
        class="p-1 rounded text-white/30 hover:bg-white/10 transition-all touch-manipulation"
      >
        <X class="w-3.5 h-3.5" />
      </button>
    </div>

    <!-- Botón agregar -->
    <button
      v-if="!adding"
      @click="startAdding"
      class="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all touch-manipulation"
    >
      <Plus class="w-3.5 h-3.5" />
      Agregar subtarea
    </button>

    <!-- Hint doble click -->
    <p v-if="subtasks.length > 0 && !adding" class="text-xs text-white/20 px-3">
      Doble clic para editar un título
    </p>
  </div>
</template>
