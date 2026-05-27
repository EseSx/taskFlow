<script setup lang="ts">
// ── Componente Toast ──────────────────────────────────────────────
// Muestra notificaciones temporales en la esquina de la pantalla
// Se coloca una sola vez en App.vue y el resto de la app usa useToast()

import { useToast } from '@/composables/useToast'

// Obtenemos la lista de toasts activos y la función para removerlos
const { toasts, removeToast } = useToast()

// Mapa de clases de Tailwind según el tipo de toast
const typeClasses: Record<string, string> = {
  success: 'bg-green-500',
  error:   'bg-red-500',
  warning: 'bg-yellow-500',
  info:    'bg-blue-500',
}

// Iconos según el tipo de toast
const typeIcons: Record<string, string> = {
  success: '✓',
  error:   '✕',
  warning: '⚠',
  info:    'ℹ',
}
</script>

<template>
  <!-- Contenedor fijo en la esquina inferior derecha -->
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">

    <!-- Transición de entrada/salida para cada toast -->
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['flex items-center gap-3 px-4 py-3 rounded-lg text-white text-sm font-medium shadow-lg cursor-pointer min-w-64 max-w-sm', typeClasses[toast.type]]"
        @click="removeToast(toast.id)"
      >
        <!-- Ícono del tipo de notificación -->
        <span class="text-base font-bold shrink-0">
          {{ typeIcons[toast.type] }}
        </span>

        <!-- Mensaje del toast -->
        <span class="flex-1">{{ toast.message }}</span>

        <!-- Botón de cierre -->
        <button class="shrink-0 opacity-70 hover:opacity-100 transition-opacity">
          ✕
        </button>
      </div>
    </transition-group>

  </div>
</template>

<style scoped>
/* Animación de entrada y salida de los toasts */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>