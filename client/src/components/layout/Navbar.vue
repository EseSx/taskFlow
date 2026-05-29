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

  return map[route.path] ?? 'TaskFlow'
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header
    class="h-16 bg-gray-900/80 backdrop-blur border-b border-white/5 flex items-center px-4 gap-4 shrink-0 sticky top-0 z-10"
  >
    <!-- Toggle sidebar -->
    <button
      @click="$emit('toggle-sidebar')"
      class="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
      aria-label="Toggle sidebar"
    >
      <PanelLeft class="w-4 h-4" />
    </button>

    <!-- Page title -->
    <div class="flex items-center gap-2 flex-1">
      <h1 class="text-white text-sm font-semibold cursor-default">
        {{ pageTitle }}
      </h1>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2">
      <!-- Greeting -->
      <span class="text-white/30 text-xs hidden sm:block cursor-default">
        Hola, {{ authStore.user?.name?.split(' ')[0] ?? 'Usuario' }}
      </span>

      <!-- Divider -->
      <div class="w-px h-4 bg-white/10 hidden sm:block" />

      <!-- Logout -->
      <button
        @click="handleLogout"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all cursor-pointer"
      >
        <LogOut class="w-3.5 h-3.5" />
        Salir
      </button>
    </div>
  </header>
</template>
