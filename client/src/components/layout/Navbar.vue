<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { PanelLeft, LogOut } from 'lucide-vue-next'

defineProps<{ sidebarOpen: boolean }>()
defineEmits(['toggle-sidebar'])

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const pageTitle = computed(() => {
  const map: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/tasks': 'Mis Tareas',
  }
  // TaskDetail muestra "Detalle" para rutas /tasks/:id
  if (route.path.startsWith('/tasks/')) return 'Detalle de tarea'
  return map[route.path] ?? 'TaskFlow'
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header
    class="h-14 sm:h-16 bg-gray-900/80 backdrop-blur border-b border-white/5 flex items-center px-3 sm:px-4 gap-3 shrink-0 sticky top-0 z-10"
  >
    <!-- Hamburger (siempre visible) -->
    <button
      @click="$emit('toggle-sidebar')"
      class="w-9 h-9 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/5 active:bg-white/10 transition-all touch-manipulation"
      aria-label="Abrir menú"
    >
      <PanelLeft class="w-4 h-4" />
    </button>

    <!-- Título -->
    <h1 class="text-white text-sm font-semibold flex-1 truncate select-none">{{ pageTitle }}</h1>

    <!-- Saludo solo sm+ -->
    <span class="text-white/30 text-xs hidden sm:block select-none shrink-0">
      Hola, {{ authStore.user?.name?.split(' ')[0] ?? 'Usuario' }}
    </span>
    <div class="w-px h-4 bg-white/10 hidden sm:block shrink-0" />

    <!-- Logout -->
    <button
      @click="handleLogout"
      class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-white/50 hover:text-red-400 hover:bg-red-400/10 active:bg-red-400/15 transition-all touch-manipulation shrink-0"
    >
      <LogOut class="w-3.5 h-3.5" />
      <span class="hidden sm:block">Salir</span>
    </button>
  </header>
</template>
