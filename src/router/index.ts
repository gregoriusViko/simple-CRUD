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
          path: '/',
          name: 'Home',
          component: () => import('../features/employees/views/EmployeesView.vue'),
        },
      ]
    },
  ],
})

export default router
