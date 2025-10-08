import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import DashboardView from '@/views/admin/Dashboard.vue'
import Rooms from '@/views/admin/Rooms.vue'
import Reservations from '@/views/admin/Reservations.vue'
import FixedSchedules from '@/views/admin/FixedSchedules.vue'
import Profile from '@/views/admin/Profile.vue'

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Dashboard', component: DashboardView }, 
      { path: 'rooms', name: 'Rooms', component: Rooms },
      { path: 'reservations', name: 'Reservations', component: Reservations },
      { path: 'fixed-schedules', name: 'FixedSchedules', component: FixedSchedules },
      { path: 'profile', name: 'Profile', component: Profile },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Proteksi route (global guard)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && token) {
    next('/admin')
  } else {
    next()
  }
})

export default router
