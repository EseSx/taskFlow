<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Mail } from 'lucide-vue-next'

// Si venimos del registro, el email puede venir como query param
// para mostrarlo en la pantalla
const route = useRoute()
const email = route.query.email as string | undefined
</script>

<template>
  <div class="min-h-screen bg-gray-950 flex items-center justify-center p-4">
    <div class="w-full max-w-md text-center space-y-6">
      <!-- Ícono -->
      <div class="flex justify-center">
        <div
          class="w-16 h-16 rounded-2xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center"
        >
          <Mail class="w-8 h-8 text-blue-400" />
        </div>
      </div>

      <!-- Texto -->
      <div class="space-y-2">
        <h1 class="text-2xl font-bold text-white">Revisa tu email</h1>
        <p class="text-white/50 text-sm leading-relaxed">
          Te enviamos un link de verificación a
          <span v-if="email" class="text-white/80 font-medium">{{ email }}</span>
          <span v-else>tu casilla de correo</span>. Hace clic en el link para activar tu cuenta.
        </p>
      </div>

      <!-- Card informativa -->
      <div class="bg-white/5 border border-white/8 rounded-2xl p-5 text-left space-y-3">
        <p class="text-white/60 text-xs font-medium uppercase tracking-wider">Qué hacer</p>
        <ol class="space-y-2">
          <li class="flex items-start gap-2 text-sm text-white/60">
            <span class="text-blue-400 font-bold shrink-0">1.</span>
            Abrí tu casilla de email
          </li>
          <li class="flex items-start gap-2 text-sm text-white/60">
            <span class="text-blue-400 font-bold shrink-0">2.</span>
            Busca un email de <span class="text-white/80">onboarding@resend.dev</span>
          </li>
          <li class="flex items-start gap-2 text-sm text-white/60">
            <span class="text-blue-400 font-bold shrink-0">3.</span>
            Hace clic en "Verificar mi cuenta"
          </li>
        </ol>
      </div>

      <p class="text-white/30 text-xs">
        El link expira en 24 horas. Si no lo encontrás, revisa la carpeta de spam.
      </p>

      <router-link
        to="/login"
        class="inline-block text-sm text-white/40 hover:text-white transition-colors"
      >
        ← Volver al login
      </router-link>
    </div>
  </div>
</template>
