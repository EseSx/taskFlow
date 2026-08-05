import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ── Rutas públicas ──────────────────────────────────────────
    {
      path: '/',
      component: () => import('@/layouts/PublicLayout.vue'),
      children: [
        { path: '', redirect: '/login' },
        { path: 'login', name: 'Login', component: () => import('@/views/Login.vue') },
        { path: 'register', name: 'Register', component: () => import('@/views/Register.vue') },
      ],
    },

    // ── Rutas protegidas ────────────────────────────────────────
    {
      path: '/',
      component: () => import('@/layouts/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: 'dashboard', name: 'Dashboard', component: () => import('@/views/Dashboard.vue') },
        { path: 'tasks', name: 'Tasks', component: () => import('@/views/Tasks.vue') },
        {
          path: 'tasks/:id',
          name: 'TaskDetail',
          component: () => import('@/views/TaskDetail.vue'),
        },
      ],
    },

    // ── 404 ─────────────────────────────────────────────────────
    { path: '/:pathMatch(.*)*', redirect: '/login' },
  ],
})

// ── Navigation guard ──────────────────────────────────────────────
// Ya no leemos localStorage. Usamos el store (que fue hidratado
// por checkAuth en App.vue al iniciar la app).
router.beforeEach((to) => {
  const authStore = useAuthStore()

  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth)
  const isAuth = authStore.isAuthenticated

  if (requiresAuth && !isAuth) return { name: 'Login' }
  if (!requiresAuth && isAuth && (to.name === 'Login' || to.name === 'Register')) {
    return { name: 'Dashboard' }
  }
})

export default router
