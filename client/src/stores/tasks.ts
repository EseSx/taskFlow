import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Task {
  id: number
  title: string
  completed: boolean
} // Define una interfaz para las tareas, con un id único, un título y un estado de completado

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])

  const addTask = (title: string) => {
    tasks.value.push({
      id: Date.now(),
      title,
      completed: false
    })
  } // Agrega una nueva tarea al array de tareas, asignándole un id único basado en la marca de tiempo actual, el título proporcionado y un estado de completado inicial de false

  const removeTask = (id: number) => {
    tasks.value = tasks.value.filter(task => task.id !== id)
  } // Elimina una tarea del array de tareas filtrando por su id, manteniendo solo las tareas que no coincidan con el id proporcionado 

  const toggleTask = (id: number) => {
    const task = tasks.value.find(task => task.id === id)

    if (task) {
      task.completed = !task.completed
    }
  } // Cambia el estado de completado de una tarea específica buscando por su id y alternando su valor booleano

  return {
    tasks,
    addTask,
    removeTask,
    toggleTask
  }
})