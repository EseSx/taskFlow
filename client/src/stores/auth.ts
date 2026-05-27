// ── Store de autenticación ────────────────────────────────────────
// Maneja el estado global de la sesión del usuario
// Persiste el token JWT en localStorage para mantener la sesión

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'

// Tipo del usuario autenticado
interface User {
  id: number
  email: string
  name: string
  createdAt: string
}

export const useAuthStore = defineStore('auth', () => {
  // ── Estado ───────────────────────────────────────────────────────

  // Usuario actualmente autenticado (null = no autenticado)
  const user = ref<User | null>(null)

  // Indica si hay una operación de auth en curso (login, register)
  const loading = ref(false)

  // Mensaje de error de autenticación
  const error = ref<string | null>(null)

  // ── Getters ──────────────────────────────────────────────────────

  // true si hay un usuario autenticado
  const isAuthenticated = computed(() => !!user.value)

  // ── Actions ───────────────────────────────────────────────────────

  // Registra un nuevo usuario en el backend
  const register = async (name: string, email: string, password: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post<{ data: { user: User; token: string } }>(
        '/auth/register',
        { name, email, password }
      )

      // Guardamos el usuario y el token
      user.value = response.data.user
      localStorage.setItem('token', response.data.token)
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Error al registrarse'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Autentica a un usuario existente con sus credenciales
  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post<{ data: { user: User; token: string } }>(
        '/auth/login',
        { email, password }
      )

      // Guardamos el usuario autenticado en el estado
      user.value = response.data.user

      // Guardamos el token en localStorage para persistencia entre sesiones
      localStorage.setItem('token', response.data.token)
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Credenciales inválidas'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Cierra la sesión del usuario
  const logout = () => {
    // Limpiamos el estado local
    user.value = null

    // Eliminamos el token del localStorage
    localStorage.removeItem('token')
  }

  // Verifica si hay un token guardado y carga el perfil del usuario
  // Se llama al montar la aplicación (en App.vue)
  const checkAuth = async () => {
    const token = localStorage.getItem('token')

    // Si no hay token, no hacemos nada
    if (!token) return

    try {
      // Verificamos que el token siga siendo válido consultando el perfil
      const response = await api.get<{ data: { user: User } }>('/auth/me')
      user.value = response.data.user
    } catch {
      // Si el token expiró o es inválido, limpiamos la sesión
      localStorage.removeItem('token')
      user.value = null
    }
  }

  // Limpia el error de autenticación
  const clearError = () => {
    error.value = null
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    checkAuth,
    clearError,
  }
})