import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import DashboardView from '@/views/admin/Dashboard.vue'
import Rooms from '@/views/admin/Rooms.vue'
import Reservations from '@/views/admin/Reservations.vue'
import FixedSchedules from '@/views/admin/FixedSchedules.vue'
import Profile from '@/views/admin/Profile.vue'
import TambahRuangan from '@/views/admin/TambahRuangan.vue'
import EditRuangan from '@/views/admin/EditRuangan.vue'
import User from '@/views/admin/User.vue'
import TambahUser from '@/views/admin/TambahUser.vue'
import EditUser from '@/views/admin/EditUser.vue'
import TambahFixedSchedule from '@/views/admin/TambahFixedSchedule.vue'
import EditFixedSchedule from '@/views/admin/EditFixedSchedule.vue'

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
      { path: 'tambah-ruangan', name: 'TambahRuangan', component: TambahRuangan },
      {
        path: 'edit-ruangan/:id',
        name: 'EditRuangan',
        component: EditRuangan,
        props: true,
      },

      { path: 'reservations', name: 'Reservations', component: Reservations },

      { path: 'fixed-schedules', name: 'FixedSchedules', component: FixedSchedules },
      { path: 'tambah-fixed-schedule', name: 'TambahFixedSchedule', component: TambahFixedSchedule },
      {
        path: 'edit-fixed-schedule/:id',
        name: 'EditFixedSchedule',
        component: EditFixedSchedule,
        props: true,
      },

      { path: 'profile', name: 'Profile', component: Profile },

      { path: 'users', name: 'User', component: User },
      { path: 'tambah-user', name: 'TambahUser', component: TambahUser },
      {
        path: 'edit-user/:id',
        name: 'EditUser',
        component: EditUser,
        props: true,
      },
    ],
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

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
