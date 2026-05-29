<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Navbar from '@/components/layout/Navbar.vue'

// Mobile: cerrado. Desktop (≥1024px): abierto.
const sidebarOpen = ref(false)

const syncSidebar = () => {
  sidebarOpen.value = window.innerWidth >= 1024
}

onMounted(() => {
  syncSidebar()
  window.addEventListener('resize', syncSidebar)
})
onUnmounted(() => window.removeEventListener('resize', syncSidebar))
</script>

<template>
  <div class="relative min-h-screen bg-gray-950 flex overflow-hidden">
    <!-- Fondo decorativo solo desktop -->
    <div class="waves-bg hidden lg:block">
      <svg class="waves-svg" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <path
          class="wave-path wave-path-1"
          d="M0,320L80,330C160,340,320,360,480,350C640,340,800,300,960,290C1120,280,1280,300,1440,320L1440,900L0,900Z"
        />
        <path
          class="wave-path wave-path-2"
          d="M0,520L90,500C180,480,360,460,540,470C720,480,900,520,1080,530C1260,540,1380,520,1440,500L1440,900L0,900Z"
        />
        <path
          class="wave-path wave-path-3"
          d="M0,720L100,700C200,680,400,660,620,680C840,700,1080,760,1260,770C1380,776,1440,760,1440,760L1440,900L0,900Z"
        />
      </svg>
    </div>

    <!-- Sidebar -->
    <div class="relative z-30">
      <Sidebar :open="sidebarOpen" @close="sidebarOpen = false" />
    </div>

    <!-- Overlay mobile -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/50 z-20 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Main -->
    <div
      :class="[
        'relative z-10 flex-1 flex flex-col min-w-0 transition-all duration-300',
        sidebarOpen ? 'lg:ml-64' : 'ml-0',
      ]"
    >
      <Navbar :sidebarOpen="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <main class="flex-1 p-4 sm:p-6 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.waves-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  opacity: 0.8;
}
.waves-svg {
  position: absolute;
  width: 180%;
  height: 110%;
  left: -40%;
  top: 0;
  opacity: 0.32;
  filter: blur(16px);
  transform: scale(1.08);
}
.wave-path {
  will-change: transform;
  transform-origin: center;
  opacity: 0.9;
}
.wave-path-1 {
  fill: rgba(59, 130, 246, 0.16);
  animation: wf1 18s ease-in-out infinite alternate;
}
.wave-path-2 {
  fill: rgba(139, 92, 246, 0.13);
  animation: wf2 24s ease-in-out infinite alternate;
}
.wave-path-3 {
  fill: rgba(34, 211, 238, 0.1);
  animation: wf3 28s ease-in-out infinite alternate;
}
@keyframes wf1 {
  0% {
    transform: translateX(0) translateY(0);
  }
  100% {
    transform: translateX(-120px) translateY(20px);
  }
}
@keyframes wf2 {
  0% {
    transform: translateX(-60px) translateY(0);
  }
  100% {
    transform: translateX(100px) translateY(-20px);
  }
}
@keyframes wf3 {
  0% {
    transform: translateX(0) translateY(10px);
  }
  100% {
    transform: translateX(-80px) translateY(-10px);
  }
}
</style>
