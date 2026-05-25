<script setup lang="ts">
import Sidebar from '@/components/layout/Sidebar.vue'
import Navbar from '@/components/layout/Navbar.vue'
</script>

<template>
  <div class="dashboard-layout">
    <Sidebar />

    <div>
      <Navbar />

      <main>
        <router-view />
      </main>
    </div>
  </div>
</template>