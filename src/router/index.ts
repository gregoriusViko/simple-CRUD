import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'employees',
      component: () => import('../features/employees/views/EmployeesView.vue'),
    },
  ],
})

export default router
