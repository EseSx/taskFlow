// ── Store de autenticación ────────────────────────────────────────
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'

interface User {
  id: number
  name: string
  email: string
  createdAt: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  // ── checkAuth ─────────────────────────────────────────────────
  // Llamado al iniciar la app. Verifica si hay una sesión activa
  // preguntándole al backend (la cookie se envía automáticamente).
  // Ya no leemos localStorage — el token viaja en httpOnly cookies.
  const checkAuth = async () => {
    try {
      const res = await api.get<any>('/auth/me')
      user.value = res?.data?.user ?? null
    } catch {
      // No hay sesión activa o el refresh también falló — es normal
      user.value = null
    }
  }

  // ── register ──────────────────────────────────────────────────
  const register = async (data: { name: string; email: string; password: string }) => {
    loading.value = true
    error.value = null
    try {
      const res = await api.post<any>('/auth/register', data)
      user.value = res?.data?.user ?? null
      // La cookie se seteó automáticamente por el backend
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al registrarse'
      throw e
    } finally {
      loading.value = false
    }
  }

  // ── login ─────────────────────────────────────────────────────
  const login = async (data: { email: string; password: string }) => {
    loading.value = true
    error.value = null
    try {
      const res = await api.post<any>('/auth/login', data)
      user.value = res?.data?.user ?? null
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Credenciales inválidas'
      throw e
    } finally {
      loading.value = false
    }
  }

  // ── logout ────────────────────────────────────────────────────
  // Llama al backend para que limpie las cookies httpOnly
  // (desde el frontend no podemos borrarlas directamente)
  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // Si falla la request igual limpiamos el estado local
    } finally {
      user.value = null
    }
  }

  return { user, loading, error, isAuthenticated, checkAuth, register, login, logout }
})
