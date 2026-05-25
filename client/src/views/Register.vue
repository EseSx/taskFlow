<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const error = ref('')

const handleRegister = () => {
  error.value = ''

  if (!email.value || !password.value || !confirmPassword.value) {
    error.value = 'All fields are required'

    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'

    return
  }

  router.push('/login')
}
</script>

<template>
  <div>
    <h1>Register</h1>

    <form @submit.prevent="handleRegister">

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

      <div>
        <label>Confirm Password</label>

        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Confirm password"
        />
      </div>

      <p v-if="error">
        {{ error }}
      </p>

      <button type="submit">
        Register
      </button>

    </form>
  </div>
</template>