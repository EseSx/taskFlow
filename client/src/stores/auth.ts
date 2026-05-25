import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<string | null>(null) // Guarda el usuario actual

  const login = (email: string) => {
    user.value = email

    localStorage.setItem('auth', email)
  } // simula un login y guarda el usuario en localStorage para persistencia entre sesiones

  const logout = () => {
    user.value = null

    localStorage.removeItem('auth')
  } // simula un logout y elimina el usuario de localStorage

  const checkAuth = () => {
    const storedUser = localStorage.getItem('auth')

    if (storedUser) {
      user.value = storedUser
    }
  } // verifica si hay un usuario almacenado en localStorage al cargar la aplicación y lo asigna a la variable user

  return {
    user,
    login,
    logout,
    checkAuth
  }
})