<script setup lang="ts">
import { onMounted } from 'vue'

import { useAuthStore } from '@/stores/auth'

import Toast from '@/components/ui/Toast.vue'

const authStore = useAuthStore()

onMounted(() => {
  authStore.checkAuth()
}) // Al montar la aplicación, verifica si hay un usuario autenticado almacenado en localStorage llamando a la función checkAuth del store de autenticación
</script>

<template>
  <router-view />
  <Toast />
</template>