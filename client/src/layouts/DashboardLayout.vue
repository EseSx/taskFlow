<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Navbar from '@/components/layout/Navbar.vue'

const sidebarOpen = ref(true)
</script>

<template>
  <div class="min-h-screen bg-gray-950 flex">

    <!-- Sidebar -->
    <Sidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- Main content -->
    <div
      :class="[
        'flex-1 flex flex-col min-w-0 transition-all duration-300',
        sidebarOpen ? 'ml-64' : 'ml-0'
      ]"
    >
      <Navbar :sidebarOpen="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="flex-1 p-6 overflow-auto">
        <router-view />
      </main>
    </div>

  </div>
</template>