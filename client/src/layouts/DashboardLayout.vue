<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Navbar from '@/components/layout/Navbar.vue'

const sidebarOpen = ref(true)
</script>

<template>
  <div class="relative min-h-screen bg-gray-950 flex overflow-hidden">
    <!-- Fondo waves -->
    <div class="waves-bg">
      <svg class="waves-svg" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <!-- Wave 1 -->
        <path
          class="wave-path wave-path-1"
          d="M0,320L80,330C160,340,320,360,480,350C640,340,800,300,960,290C1120,280,1280,300,1440,320L1440,900L0,900Z"
        />

        <!-- Wave 2 -->
        <path
          class="wave-path wave-path-2"
          d="M0,520L90,500C180,480,360,460,540,470C720,480,900,520,1080,530C1260,540,1380,520,1440,500L1440,900L0,900Z"
        />

        <!-- Wave 3 -->
        <path
          class="wave-path wave-path-3"
          d="M0,720L100,700C200,680,400,660,620,680C840,700,1080,760,1260,770C1380,776,1440,760,1440,760L1440,900L0,900Z"
        />
      </svg>
    </div>

    <!-- Sidebar -->
    <div class="relative z-10">
      <Sidebar :open="sidebarOpen" @close="sidebarOpen = false" />
    </div>

    <!-- Main content -->
    <div
      :class="[
        'relative z-10 flex-1 flex flex-col min-w-0 transition-all duration-300',
        sidebarOpen ? 'ml-64' : 'ml-0',
      ]"
    >
      <Navbar :sidebarOpen="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="flex-1 p-6 overflow-auto">
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

/* Base */
.wave-path {
  will-change: transform;

  transform-origin: center;

  opacity: 0.9;
}

/* Azul */
.wave-path-1 {
  fill: rgba(59, 130, 246, 0.16);

  animation:
    waveFloat1 18s ease-in-out infinite alternate,
    hueShift1 16s linear infinite;
}

/* Violeta */
.wave-path-2 {
  fill: rgba(139, 92, 246, 0.13);

  animation:
    waveFloat2 24s ease-in-out infinite alternate,
    hueShift2 18s linear infinite;
}

/* Cyan */
.wave-path-3 {
  fill: rgba(34, 211, 238, 0.1);

  animation:
    waveFloat3 28s ease-in-out infinite alternate,
    hueShift3 20s linear infinite;
}

/* Movimiento */
@keyframes waveFloat1 {
  0% {
    transform: translateX(0) translateY(0);
  }
  100% {
    transform: translateX(-120px) translateY(20px);
  }
}

@keyframes waveFloat2 {
  0% {
    transform: translateX(-60px) translateY(0);
  }
  100% {
    transform: translateX(100px) translateY(-20px);
  }
}

@keyframes waveFloat3 {
  0% {
    transform: translateX(0) translateY(10px);
  }
  100% {
    transform: translateX(-80px) translateY(-10px);
  }
}

/* Cambio de tono */
@keyframes hueShift1 {
  from {
    filter: hue-rotate(0deg);
  }
  to {
    filter: hue-rotate(30deg);
  }
}

@keyframes hueShift2 {
  from {
    filter: hue-rotate(0deg);
  }
  to {
    filter: hue-rotate(-25deg);
  }
}

@keyframes hueShift3 {
  from {
    filter: hue-rotate(0deg);
  }
  to {
    filter: hue-rotate(20deg);
  }
}
</style>
