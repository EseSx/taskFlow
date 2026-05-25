import { createRouter, createWebHistory } from 'vue-router'

import PublicLayout from '@/layouts/PublicLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      redirect: '/login'
    },

    {
      path: '/',
      component: PublicLayout,

      children: [
        {
          path: 'login',
          component: () => import('@/views/Login.vue')
        },

        {
          path: 'register',
          component: () => import('@/views/Register.vue')
        }
      ]
    },

    {
      path: '/',
      component: DashboardLayout,

      children: [
        {
          path: 'dashboard',
          component: () => import('@/views/Dashboard.vue'),
          meta: {
            requiresAuth: true
          }
        },

        {
          path: 'tasks',
          component: () => import('@/views/Tasks.vue'),
          meta: {
            requiresAuth: true
          }
        },

        {
          path: 'tasks/:id',
          component: () => import('@/views/TaskDetail.vue'),
          meta: {
            requiresAuth: true
          }
        }
      ]
    }
  ]
})

router.beforeEach((to) => {
  const isAuthenticated = localStorage.getItem('auth')

  if (to.meta.requiresAuth && !isAuthenticated) {
    return '/login'
  }
})

export default router