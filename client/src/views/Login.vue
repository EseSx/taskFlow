<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

const router = useRouter()

const authStore = useAuthStore()

const email = ref('')
const password = ref('')

const error = ref('')

const handleLogin = () => {
  error.value = ''

  if (!email.value || !password.value) {
    error.value = 'All fields are required'

    return
  }

  authStore.login(email.value)

  router.push('/dashboard')
}
</script>

<template>
  <div>
    <h1>Login</h1>

    <form @submit.prevent="handleLogin">

      <div>
        <label>Email</label>

        <input
          v-model="email"
          type="email"
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label>Password</label>

        <input
          v-model="password"
          type="password"
          placeholder="Enter your password"
        />
      </div>

      <p v-if="error">
        {{ error }}
      </p>

      <button type="submit">
        Login
      </button>

    </form>
  </div>
</template>