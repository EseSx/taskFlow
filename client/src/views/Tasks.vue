<script setup lang="ts">
import { ref } from 'vue'

import { useTasksStore } from '@/stores/tasks'

const tasksStore = useTasksStore()

const newTask = ref('')

const handleAddTask = () => {
  if (!newTask.value) return

  tasksStore.addTask(newTask.value)

  newTask.value = ''
}
</script>

<template>
  <div>
    <h1>Tasks</h1>

    <input
      v-model="newTask"
      type="text"
      placeholder="New task"
    />

    <button @click="handleAddTask">
      Add Task
    </button>

    <ul>
      <li
        v-for="task in tasksStore.tasks"
        :key="task.id"
      >
        {{ task.title }}

        <button @click="tasksStore.toggleTask(task.id)">
          Toggle
        </button>

        <button @click="tasksStore.removeTask(task.id)">
          Delete
        </button>
      </li>
    </ul>
  </div>
</template>