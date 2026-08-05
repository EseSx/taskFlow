<script setup lang="ts">
// ── Vista: Login ──────────────────────────────────────────────────
// Formulario de inicio de sesión
// Conectado al authStore que hace la llamada real al backend
// Incluye: validación, loading state y manejo de errores del backend

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { validateLoginForm } from '@/utils/validators'

const router = useRouter()
const authStore = useAuthStore()

// ── Estado local del formulario ───────────────────────────────────
const email = ref('')
const password = ref('')

// Errores de validación por campo (antes de enviar al backend)
const fieldErrors = ref<Record<string, string>>({})

// ── Handler principal ─────────────────────────────────────────────
const handleLogin = async () => {
  // Limpiamos errores previos
  fieldErrors.value = {}

  // Validamos localmente antes de hacer el request
  const errors = validateLoginForm(email.value, password.value)
  if (Object.keys(errors).length > 0) {
    fieldErrors.value = errors
    return
  }

  // Intentamos el login — el store maneja loading y error
  try {
    await authStore.login({ email: email.value, password: password.value })
    router.push('/dashboard')
  } catch (e: unknown) {
    if (e instanceof Error && e.message.includes('verificar tu email')) {
      errors.email = 'Debés verificar tu email antes de iniciar sesión'
    } else {
      errors.general = e instanceof Error ? e.message : 'Error al iniciar sesión'
    }
  }
}
</script>

<template>
  <div
    class="relative min-h-screen flex items-center justify-center bg-gray-950 overflow-hidden px-4"
  >
    <!-- Fondo animado -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Blob azul -->
      <div class="blob blob-blue" />

      <!-- Blob violeta -->
      <div class="blob blob-violet" />

      <!-- Blob cyan -->
      <div class="blob blob-cyan" />

      <!-- Glow central -->
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_75%)]"
      />
    </div>

    <div class="w-full max-w-sm z-10">
      <!-- Logo / título -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-medium text-white">TaskFlow</h1>
        <p class="text-sm text-white/40 mt-1">Iniciá sesión para continuar</p>
      </div>

      <!-- Card del formulario -->
      <div class="bg-white/5 border border-white/10 rounded-2xl p-6">
        <form @submit.prevent="handleLogin" novalidate>
          <!-- Campo Email -->
          <div class="mb-4">
            <label class="block text-xs font-medium text-white/60 mb-1.5"> Email </label>
            <input
              v-model="email"
              type="email"
              placeholder="tu@email.com"
              autocomplete="email"
              :disabled="authStore.loading"
              :class="[
                'w-full bg-white/5 border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all disabled:opacity-50',
                fieldErrors.email
                  ? 'border-red-500 focus:border-red-400'
                  : 'border-white/10 focus:border-blue-500',
              ]"
            />
            <!-- Error de validación local -->
            <p v-if="fieldErrors.email" class="text-red-400 text-xs mt-1.5 flex items-center gap-1">
              <span>⚠</span> {{ fieldErrors.email }}
            </p>
          </div>

          <!-- Campo Password -->
          <div class="mb-6">
            <label class="block text-xs font-medium text-white/60 mb-1.5"> Contraseña </label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              autocomplete="current-password"
              :disabled="authStore.loading"
              :class="[
                'w-full bg-white/5 border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all disabled:opacity-50',
                fieldErrors.password
                  ? 'border-red-500 focus:border-red-400'
                  : 'border-white/10 focus:border-blue-500',
              ]"
            />
            <!-- Error de validación local -->
            <p
              v-if="fieldErrors.password"
              class="text-red-400 text-xs mt-1.5 flex items-center gap-1"
            >
              <span>⚠</span> {{ fieldErrors.password }}
            </p>
          </div>

          <!-- Error del backend (credenciales inválidas, etc.) -->
          <div
            v-if="authStore.error"
            class="mb-4 px-3.5 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
          >
            {{ authStore.error }}
          </div>

          <!-- Botón de submit con loading state -->
          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-all"
          >
            <!-- Spinner animado mientras carga -->
            <svg
              v-if="authStore.loading"
              class="animate-spin w-4 h-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <!-- Texto cambia según el estado -->
            {{ authStore.loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
          </button>
        </form>
      </div>

      <!-- Link a registro -->
      <p class="text-center text-sm text-white/40 mt-5">
        ¿No tenés cuenta?
        <router-link to="/register" class="text-blue-400 hover:text-blue-300 transition-colors">
          Registrate
        </router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Blob base */
.blob {
  position: absolute;
  border-radius: 9999px;
  filter: blur(110px);
  will-change: transform;

  opacity: 0.45;

  mix-blend-mode: screen;
}

/* Blob azul */
.blob-blue {
  width: 32rem;
  height: 32rem;

  background: radial-gradient(
    circle at center,
    rgba(59, 130, 246, 0.95) 0%,
    rgba(59, 130, 246, 0.55) 35%,
    rgba(59, 130, 246, 0) 75%
  );

  top: -10rem;
  left: -8rem;

  animation: moveBlob1 28s infinite alternate ease-in-out;
}

/* Blob violeta */
.blob-violet {
  width: 36rem;
  height: 36rem;

  background: radial-gradient(
    circle at center,
    rgba(139, 92, 246, 0.95) 0%,
    rgba(139, 92, 246, 0.5) 35%,
    rgba(139, 92, 246, 0) 75%
  );

  bottom: -14rem;
  right: -10rem;

  animation: moveBlob2 32s infinite alternate ease-in-out;
}

/* Blob cyan */
.blob-cyan {
  width: 28rem;
  height: 28rem;

  background: radial-gradient(
    circle at center,
    rgba(34, 211, 238, 0.8) 0%,
    rgba(34, 211, 238, 0.35) 35%,
    rgba(34, 211, 238, 0) 75%
  );

  top: 40%;
  left: 50%;

  transform: translate(-50%, -50%);

  opacity: 0.3;

  animation: moveBlob3 24s infinite alternate ease-in-out;
}

/* Movimiento blob 1 */
@keyframes moveBlob1 {
  0% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(8rem, 4rem) scale(1.1);
  }
  50% {
    transform: translate(16rem, -6rem) scale(0.95);
  }
  75% {
    transform: translate(-4rem, 8rem) scale(1.05);
  }
  100% {
    transform: translate(10rem, -2rem) scale(1);
  }
}

/* Movimiento blob 2 */
@keyframes moveBlob2 {
  0% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(-10rem, -4rem) scale(1.08);
  }
  50% {
    transform: translate(-18rem, 8rem) scale(0.92);
  }
  75% {
    transform: translate(6rem, -6rem) scale(1.04);
  }
  100% {
    transform: translate(-8rem, 4rem) scale(1);
  }
}

/* Movimiento blob 3 */
@keyframes moveBlob3 {
  0% {
    transform: translate(-50%, -50%) translate(0, 0) scale(1);
  }
  25% {
    transform: translate(-50%, -50%) translate(6rem, -4rem) scale(1.06);
  }
  50% {
    transform: translate(-50%, -50%) translate(-8rem, 6rem) scale(0.94);
  }
  75% {
    transform: translate(-50%, -50%) translate(10rem, 2rem) scale(1.02);
  }
  100% {
    transform: translate(-50%, -50%) translate(-4rem, -6rem) scale(1);
  }
}
</style>
