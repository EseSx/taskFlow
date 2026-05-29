<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

defineProps<{ sidebarOpen: boolean }>()
defineEmits(['toggle-sidebar'])

const route     = useRoute()
const router    = useRouter()
const authStore = useAuthStore()

const pageTitle = computed(() => {
  const map: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/tasks':     'Mis Tareas',
  }
  return map[route.path] ?? 'TaskFlow'
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="h-16 bg-gray-900/80 backdrop-blur border-b border-white/5 flex items-center px-4 gap-4 shrink-0 sticky top-0 z-10">

    <!-- Toggle sidebar -->
    <button
      @click="$emit('toggle-sidebar')"
      class="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"
      aria-label="Toggle sidebar"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="3"  width="14" height="1.5" rx="0.75" fill="currentColor"/>
        <rect x="1" y="7"  width="10" height="1.5" rx="0.75" fill="currentColor"/>
        <rect x="1" y="11" width="14" height="1.5" rx="0.75" fill="currentColor"/>
      </svg>
    </button>

    <!-- Page title -->
    <div class="flex items-center gap-2 flex-1">
      <h1 class="text-white text-sm font-semibold">{{ pageTitle }}</h1>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2">
      <!-- Greeting -->
      <span class="text-white/30 text-xs hidden sm:block">
        Hola, {{ authStore.user?.name?.split(' ')[0] ?? 'Usuario' }}
      </span>

      <!-- Divider -->
      <div class="w-px h-4 bg-white/10 hidden sm:block" />

      <!-- Logout -->
      <button
        @click="handleLogout"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 2H2.5A1.5 1.5 0 0 0 1 3.5v7A1.5 1.5 0 0 0 2.5 12H5M9.5 9.5 13 7l-3.5-2.5M13 7H5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Salir
      </button>
    </div>
  </header>
</template>