// ── Composable: useToast ──────────────────────────────────────────
// Maneja las notificaciones toast de la aplicación
// Se usa como: const { showToast } = useToast()
// Luego: showToast('Tarea creada', 'success')

import { ref } from 'vue'

// Tipo de notificación disponible
type ToastType = 'success' | 'error' | 'warning' | 'info'

// Estructura de un toast
interface Toast {
  id: number
  message: string
  type: ToastType
}

// Estado compartido entre todas las instancias del composable
// Al ser ref() fuera del composable, es un singleton
const toasts = ref<Toast[]>([])
let nextId = 0

export function useToast() {
  // Muestra una nueva notificación toast
  const showToast = (message: string, type: ToastType = 'info', duration = 3000) => {
    // Creamos el toast con un id único
    const id = nextId++
    toasts.value.push({ id, message, type })

    // Removemos el toast automáticamente después del tiempo indicado
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  // Elimina un toast por su id
  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  // Helpers para los tipos más comunes
  const success = (message: string) => showToast(message, 'success')
  const error = (message: string) => showToast(message, 'error')
  const warning = (message: string) => showToast(message, 'warning')
  const info = (message: string) => showToast(message, 'info')

  return {
    toasts,     // Lista reactiva de toasts (para el componente Toast.vue)
    showToast,
    removeToast,
    success,
    error,
    warning,
    info,
  }
}