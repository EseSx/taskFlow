<script setup lang="ts">
// ── Componente TaskForm ───────────────────────────────────────────
// Formulario reutilizable para crear y editar tareas
// Si recibe una `task` como prop, opera en modo edición
// Si no recibe ninguna, opera en modo creación

import { ref, watch } from 'vue'
import type { Task } from '@/services/taskService'

const props = defineProps<{
  task?: Task | null    // Si se pasa, el formulario está en modo edición
  loading?: boolean     // Para deshabilitar el botón mientras se guarda
}>()

const emit = defineEmits<{
  submit: [data: { title: string; description: string; priority: string; dueDate: string }]
  cancel: []
}>()

// ── Estado del formulario ─────────────────────────────────────────
const title       = ref(props.task?.title ?? '')
const description = ref(props.task?.description ?? '')
const priority    = ref(props.task?.priority ?? 'MEDIUM')
const dueDate     = ref(props.task?.dueDate?.split('T')[0] ?? '') // Solo la fecha, no la hora

// Error de validación del título
const titleError = ref('')

// Si cambia la tarea (modo edición), actualizamos el formulario
watch(() => props.task, (newTask) => {
  title.value       = newTask?.title ?? ''
  description.value = newTask?.description ?? ''
  priority.value    = newTask?.priority ?? 'MEDIUM'
  dueDate.value     = newTask?.dueDate?.split('T')[0] ?? ''
})

// Valida y emite el submit al componente padre
const handleSubmit = () => {
  // Validación mínima del título
  if (!title.value.trim()) {
    titleError.value = 'El título es requerido'
    return
  }

  titleError.value = ''

  // Emitimos los datos al padre para que maneje la llamada a la API
  emit('submit', {
    title:       title.value.trim(),
    description: description.value.trim(),
    priority:    priority.value,
    dueDate:     dueDate.value,
  })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">

    <!-- Título -->
    <div>
      <label class="block text-xs font-medium text-white/60 mb-1.5">
        Título <span class="text-red-400">*</span>
      </label>
      <input
        v-model="title"
        type="text"
        placeholder="¿Qué tenés que hacer?"
        maxlength="200"
        :class="[
          'w-full bg-white/5 border rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none transition-all',
          titleError ? 'border-red-400 focus:border-red-400' : 'border-white/10 focus:border-blue-400'
        ]"
        autofocus
      />
      <p v-if="titleError" class="text-red-400 text-xs mt-1">{{ titleError }}</p>
    </div>

    <!-- Descripción -->
    <div>
      <label class="block text-xs font-medium text-white/60 mb-1.5">Descripción</label>
      <textarea
        v-model="description"
        placeholder="Detalles opcionales..."
        rows="3"
        class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-blue-400 transition-all resize-none"
      />
    </div>

    <!-- Prioridad y fecha en la misma fila -->
    <div class="grid grid-cols-2 gap-3">

      <!-- Prioridad -->
      <div>
        <label class="block text-xs font-medium text-white/60 mb-1.5">Prioridad</label>
        <select
          v-model="priority"
          class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-400 transition-all"
        >
          <option value="LOW">🔵 Baja</option>
          <option value="MEDIUM">🟡 Media</option>
          <option value="HIGH">🔴 Alta</option>
        </select>
      </div>

      <!-- Fecha límite -->
      <div>
        <label class="block text-xs font-medium text-white/60 mb-1.5">Fecha límite</label>
        <input
          v-model="dueDate"
          type="date"
          class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-400 transition-all"
        />
      </div>
    </div>

    <!-- Botones de acción -->
    <div class="flex justify-end gap-2 pt-2">
      <!-- Cancelar -->
      <button
        type="button"
        @click="emit('cancel')"
        class="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
      >
        Cancelar
      </button>

      <!-- Guardar -->
      <button
        type="submit"
        :disabled="loading"
        class="px-5 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all"
      >
        {{ loading ? 'Guardando...' : (task ? 'Actualizar' : 'Crear tarea') }}
      </button>
    </div>

  </form>
</template>