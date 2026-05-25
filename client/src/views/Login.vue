<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

const email = ref('')

const router = useRouter()

const authStore = useAuthStore()

const handleLogin = () => {
  if (!email.value) return

  authStore.login(email.value)

  router.push('/dashboard')
} // Maneja el proceso de inicio de sesión verificando que se haya ingresado un correo electrónico, llamando a la función de inicio de sesión del store de autenticación con el correo electrónico proporcionado y redirigiendo al usuario al dashboard después de iniciar sesión
</script>

<template>
  <div>
    <h1>Login</h1>

    <input
      v-model="email"
      type="email"
      placeholder="Email"
    />

    <button @click="handleLogin">
      Login
    </button>
  </div>
</template>