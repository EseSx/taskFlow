<script setup lang="ts">
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

const router = useRouter()

const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()

  router.push('/login')
} // Maneja el proceso de cierre de sesión llamando a la función de logout del store de autenticación y redirigiendo al usuario a la página de login después de cerrar sesión
</script>

<template>
  <header>
    <h1>Navbar</h1>

    <p>
      {{ authStore.user }}
    </p>

    <button @click="handleLogout">
      Logout
    </button>
  </header>
</template>