import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './stores/auth'

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', name: 'home', component: () => import('./pages/HomePage.vue') },
    { path: '/b/:slug', name: 'business', component: () => import('./pages/BusinessPage.vue'), props: true },
    { path: '/login', name: 'login', component: () => import('./pages/LoginPage.vue'), meta: { guestOnly: true } },
    { path: '/register', name: 'register', component: () => import('./pages/RegisterPage.vue'), meta: { guestOnly: true } },
    { path: '/forgot-password', name: 'forgot-password', component: () => import('./pages/ForgotPasswordPage.vue'), meta: { guestOnly: true } },
    { path: '/reset-password', name: 'reset-password', component: () => import('./pages/ResetPasswordPage.vue') },
    { path: '/my-bookings', name: 'my-bookings', component: () => import('./pages/MyBookingsPage.vue'), meta: { requiresAuth: true } },
    { path: '/profile', name: 'profile', component: () => import('./pages/ProfilePage.vue'), meta: { requiresAuth: true } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('./pages/NotFoundPage.vue') },
  ],
})

router.beforeEach(to => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn)
    return { name: 'login', query: { redirect: to.fullPath } }

  if (to.meta.guestOnly && auth.isLoggedIn)
    return { name: 'my-bookings' }
})

/** Only follow same-site redirect targets (no open redirects via ?redirect=). */
export function safeRedirect(value: unknown, fallback = '/my-bookings'): string {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : fallback
}
