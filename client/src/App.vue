<script setup lang="ts">
import { onMounted } from 'vue'

import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  authStore.checkAuth()
}) // Al montar la aplicación, verifica si hay un usuario autenticado almacenado en localStorage llamando a la función checkAuth del store de autenticación
</script>

<template>
  <router-view />
</template>