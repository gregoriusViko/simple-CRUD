import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // path: '/',
      // name: 'employees',
      // component: () => import('../features/employees/views/EmployeesView.vue'),

       path: '/',
      component: MainLayout,
      children: [
        {
          path: '/karyawan/daftar',
          name: 'daftar-karyawan',
          component: () => import('../features/employees/views/EmployeesView.vue'),
        },

        {
          path: '/coba',
          name: 'Coba',
          component: () => import('../features/employees/views/CobaView.vue'),
        },
      ]
    },
  ],
})

export default router
