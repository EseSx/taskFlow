// ── Store de autenticación ────────────────────────────────────────
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api, setAccessToken } from '@/services/api'

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
  const checkAuth = async () => {
    try {
      const refreshRes = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      })
      if (!refreshRes.ok) throw new Error()
      const data = await refreshRes.json()
      setAccessToken(data?.data?.accessToken ?? null)
      user.value = data?.data?.user ?? null
    } catch {
      user.value = null
      setAccessToken(null)
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
      setAccessToken(res?.data?.accessToken ?? null) // ← guardar el token en memoria
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Credenciales inválidas'
      throw e
    } finally {
      loading.value = false
    }
  }

  // ── logout ────────────────────────────────────────────────────
  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {
    } finally {
      user.value = null
      setAccessToken(null)
    }
  }

  return { user, loading, error, isAuthenticated, checkAuth, register, login, logout }
})
