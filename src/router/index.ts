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
          path: 'karyawan/daftar',
          name: 'daftar-karyawan',
          component: () => import('../features/employees/views/EmployeesView.vue'),
        },

        {
          path: '/keuangan/',
          children: [
            {
              path: 'pemasukan',
              name: 'pemasukan',
              component: () => import('../features/cashflow/views/IncomeView.vue'),
            },
            // {
            //   path: 'pengeluaran',
            //   name: 'pengeluaran',
            //   component: () => import('../features/cashflow/views/ExpenseView.vue'),
            // },
            {
              path: 'laporan',
              name: 'laporan',
              component: () => import ('../features/cashflow/views/CashflowReportView.vue')
            },
          ],
        },

        {
          path: '/coba',
          name: 'Coba',
          component: () => import('../features/employees/views/CobaView.vue'),
        },
        {
          path: '/coba2',
          name: 'Coba2',
          component: () => import('../features/employees/views/Coba2View.vue'),
        },
        {
          path: '/coba3',
          name: 'Coba3',
          component: () => import('../features/employees/views/Coba3View.vue'),
        },
        {
          path: '/invoice',
          name: 'invoice',
          component: () => import('../features/employees/views/InvoicePage.vue'),
        },
      ],
    },
  ],
})

export default router
