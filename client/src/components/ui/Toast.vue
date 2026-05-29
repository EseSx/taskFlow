<script setup lang="ts">
// ── Componente Toast ──────────────────────────────────────────────

import { useToast } from '@/composables/useToast'

import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-vue-next'

const { toasts, removeToast } = useToast()

const typeClasses: Record<string, string> = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
}

const typeIcons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
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
        :class="[
          'flex items-center gap-3 px-4 py-3 rounded-lg text-white text-sm font-medium shadow-lg cursor-pointer min-w-64 max-w-sm',
          typeClasses[toast.type],
        ]"
        @click="removeToast(toast.id)"
      >
        <!-- Ícono -->
        <component :is="typeIcons[toast.type]" class="w-4 h-4 shrink-0" stroke-width="2.2" />

        <!-- Mensaje -->
        <span class="flex-1">{{ toast.message }}</span>

        <!-- Cerrar -->
        <button class="shrink-0 opacity-70 hover:opacity-100 transition-opacity">
          <X class="w-4 h-4" stroke-width="2.2" />
        </button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
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
