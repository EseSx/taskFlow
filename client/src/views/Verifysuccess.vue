<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/services/api'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

type Status = 'loading' | 'success' | 'error'

const status = ref<Status>('loading')
const message = ref('')

onMounted(async () => {
  const token = route.query.token as string

  if (!token) {
    status.value = 'error'
    message.value = 'Token de verificación no encontrado en la URL.'
    return
  }

  try {
    // Llama al backend con el token
    const res = await api.get<any>(`/auth/verify?token=${token}`)

    // El backend seteó las cookies y devolvió el usuario
    authStore.user = res?.data?.user ?? null

    status.value = 'success'
    message.value = res.message ?? '¡Tu cuenta está activa!'

    // Redirigir al dashboard después de 2 segundos
    setTimeout(() => router.push('/dashboard'), 2000)
  } catch (e) {
    status.value = 'error'
    message.value = e instanceof Error ? e.message : 'Error al verificar el email.'
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-950 flex items-center justify-center p-4">
    <div class="w-full max-w-sm text-center space-y-6">
      <!-- Loading -->
      <template v-if="status === 'loading'">
        <div class="flex justify-center">
          <Loader2 class="w-12 h-12 text-blue-400 animate-spin" />
        </div>
        <p class="text-white/50 text-sm">Verificando tu cuenta...</p>
      </template>

      <!-- Éxito -->
      <template v-else-if="status === 'success'">
        <div class="flex justify-center">
          <div
            class="w-16 h-16 rounded-2xl bg-green-500/15 border border-green-500/20 flex items-center justify-center"
          >
            <CheckCircle2 class="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div class="space-y-2">
          <h1 class="text-2xl font-bold text-white">¡Cuenta verificada!</h1>
          <p class="text-white/50 text-sm">{{ message }}</p>
          <p class="text-white/30 text-xs">Redirigiendo al dashboard...</p>
        </div>
      </template>

      <!-- Error -->
      <template v-else>
        <div class="flex justify-center">
          <div
            class="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/20 flex items-center justify-center"
          >
            <XCircle class="w-8 h-8 text-red-400" />
          </div>
        </div>
        <div class="space-y-2">
          <h1 class="text-2xl font-bold text-white">Error de verificación</h1>
          <p class="text-white/50 text-sm">{{ message }}</p>
        </div>
        <router-link
          to="/register"
          class="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-all"
        >
          Registrarme de nuevo
        </router-link>
      </template>
    </div>
  </div>
</template>
