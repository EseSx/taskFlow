import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const sidebarOpen = ref(true) // Controla si la barra lateral está abierta o cerrada, inicializada como abierta

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  } // Alterna el estado de la barra lateral entre abierta y cerrada cambiando su valor booleano

  return {
    sidebarOpen,
    toggleSidebar
  }
})