import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ── Rutas públicas ────────────────────────────────────────────
    {
      path: '/',
      component: () => import('@/layouts/PublicLayout.vue'),
      children: [
        { path: '', redirect: '/login' },
        { path: 'login', name: 'Login', component: () => import('@/views/Login.vue') },
        { path: 'register', name: 'Register', component: () => import('@/views/Register.vue') },
      ],
    },

    // ── Verificación de email (fuera del layout público/privado) ──
    // /verify-email → pantalla "revisá tu email" (post-registro)
    {
      path: '/verify-email',
      name: 'VerifyEmail',
      component: () => import('@/views/Verifyemail.vue'),
    },
    // /verify-email/confirm?token=xxx → el link del email aterriza acá
    {
      path: '/verify-email/confirm',
      name: 'VerifySuccess',
      component: () => import('@/views/Verifysuccess.vue'),
    },

    // ── Rutas protegidas ──────────────────────────────────────────
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

    { path: '/:pathMatch(.*)*', redirect: '/login' },
  ],
})

// ── Navigation guard ──────────────────────────────────────────────
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
