<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

defineProps<{ open: boolean }>()
defineEmits(['close'])

const route     = useRoute()
const authStore = useAuthStore()

const navLinks = [
  { to: '/dashboard', label: 'Dashboard',  icon: '⊞' },
  { to: '/tasks',     label: 'Mis Tareas',  icon: '✓' },
]
</script>

<template>
  <!-- Overlay para mobile -->
  <div
    v-if="open"
    class="fixed inset-0 bg-black/50 z-20 lg:hidden"
    @click="$emit('close')"
  />

  <!-- Sidebar panel -->
  <aside
    :class="[
      'fixed top-0 left-0 h-full w-64 z-30 flex flex-col',
      'bg-gray-900 border-r border-white/5',
      'transition-transform duration-300',
      open ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    <!-- Logo / Brand -->
    <div class="flex items-center gap-3 px-5 h-16 border-b border-white/5 shrink-0">
      <div class="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
        <span class="text-white text-xs font-bold">TF</span>
      </div>
      <span class="text-white font-semibold text-sm tracking-wide">TaskFlow</span>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 overflow-y-auto">
      <p class="text-white/30 text-xs font-medium uppercase tracking-widest px-2 mb-3">
        Menú
      </p>

      <router-link
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        :class="[
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-1 transition-all',
          route.path === link.to
            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
            : 'text-white/50 hover:text-white hover:bg-white/5'
        ]"
      >
        <span class="text-base leading-none">{{ link.icon }}</span>
        {{ link.label }}
        <!-- Indicador activo -->
        <span
          v-if="route.path === link.to"
          class="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400"
        />
      </router-link>
    </nav>

    <!-- User info al fondo -->
    <div class="px-3 pb-4 border-t border-white/5 pt-4 shrink-0">
      <div class="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/3">
        <!-- Avatar -->
        <div class="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0">
          <span class="text-white text-xs font-bold">
            {{ authStore.user?.name?.[0]?.toUpperCase() ?? 'U' }}
          </span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-white text-xs font-medium truncate">{{ authStore.user?.name ?? 'Usuario' }}</p>
          <p class="text-white/30 text-xs truncate">{{ authStore.user?.email ?? '' }}</p>
        </div>
      </div>
    </div>
  </aside>
</template>