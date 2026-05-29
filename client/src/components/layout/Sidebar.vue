<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { LayoutDashboard, CheckSquare } from 'lucide-vue-next'

defineProps<{ open: boolean }>()
const emit = defineEmits(['close'])

const route = useRoute()
const authStore = useAuthStore()

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'Mis Tareas', icon: CheckSquare },
]

const handleClick = () => {
  if (window.innerWidth <= 768) {
    emit('close')
  }
}
</script>

<template>
  <!-- Sidebar panel -->
  <aside
    :class="[
      'fixed top-0 left-0 h-full w-64 z-30 flex flex-col',
      'bg-gray-900 border-r border-white/5',
      'transition-transform duration-300 ease-in-out',
      open ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <!-- Logo -->
    <div class="flex items-center gap-3 px-5 h-16 border-b border-white/5 shrink-0">
      <div class="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
        <span class="text-white text-xs font-bold select-none">TF</span>
      </div>
      <span class="text-white font-semibold text-sm tracking-wide select-none">TaskFlow</span>
    </div>

    <!-- Nav -->
    <nav class="flex-1 px-3 py-4 overflow-y-auto">
      <p class="text-white/30 text-xs font-medium uppercase tracking-widest px-2 mb-3 select-none">
        Menú
      </p>

      <router-link
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        @click="handleClick"
        :class="[
          'flex items-center gap-3 px-3 py-3 sm:py-2.5 rounded-lg text-sm font-medium mb-1 transition-all',
          route.path === link.to
            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
            : 'text-white/50 hover:text-white hover:bg-white/5 active:bg-white/10',
        ]"
      >
        <component :is="link.icon" class="w-4 h-4 shrink-0" />
        {{ link.label }}
        <span v-if="route.path === link.to" class="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
      </router-link>
    </nav>

    <!-- User info -->
    <div class="px-3 pb-5 border-t border-white/5 pt-4 shrink-0">
      <div class="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/3">
        <div
          class="w-7 h-7 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0"
        >
          <span class="text-white text-xs font-bold select-none">
            {{ authStore.user?.name?.[0]?.toUpperCase() ?? 'U' }}
          </span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-white text-xs font-medium truncate select-none">
            {{ authStore.user?.name ?? 'Usuario' }}
          </p>
          <p class="text-white/30 text-xs truncate select-none">
            {{ authStore.user?.email ?? '' }}
          </p>
        </div>
      </div>
    </div>
  </aside>
</template>
