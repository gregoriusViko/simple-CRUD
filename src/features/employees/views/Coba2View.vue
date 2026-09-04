<template>
  <div class="w-full max-w-5xl bg-white p-6 rounded-2xl shadow-sm border border-slate-100">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h2 class="text-lg sm:text-xl font-semibold text-slate-800">Cash Flow Trend</h2>

      <!-- PrimeVue DatePicker -->
      <DatePicker v-model="dateRange" selectionMode="range" :numberOfMonths="2" placeholder="Pilih rentang tanggal"
        showIcon iconDisplay="input" class="w-full sm:w-56" :pt="{
          root: { class: 'border-slate-200 text-sm' },
          input: { class: 'py-2 px-3 shadow-none text-slate-600' }
        }">
        <template #footer>
          <div class="flex justify-end gap-2 p-3 border-t">
            <Button label="Cancel" severity="secondary" text @click="handleCancel" />
            <Button label="Apply" @click="handleApply" />
          </div>
        </template>
      </DatePicker>
    </div>

    <!-- Summary Metrics -->
    <div class="mb-8">
      <h1 class="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-2">
        $10,819.21
      </h1>
      <div class="flex items-center text-xs sm:text-sm">
        <span class="text-slate-400 font-medium">Monthly Goal : 90.12% (2,321 Orders)</span>
        <span class="flex items-center text-emerald-500 font-semibold ml-3 bg-emerald-50 px-1.5 py-0.5 rounded">
          <i class="pi pi-arrow-up text-[10px] mr-1"></i>
          4.2%
        </span>
      </div>
    </div>

    <!-- PrimeVue Chart -->
    <div class="w-full h-87.5">
      <Chart type="line" :data="chartData" :options="chartOptions" class="h-full w-full" />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMediaQuery } from '@vueuse/core'

// Deteksi layar menggunakan VueUse
const isMobile = useMediaQuery('(max-width: 768px)')

// State DatePicker didefinisikan sebagai array of Date karena menggunakan selectionMode="range"
const dateRange = ref<Date[] | null>(null)

// Tipe data kustom untuk Dataset Chart.js
interface ChartDataset {
  label: string
  data: number[]
  borderColor: string
  backgroundColor?: string
  borderWidth: number
  fill: boolean
  tension: number
  pointRadius: number
  pointHoverRadius: number
  pointHoverBackgroundColor: string
  pointHoverBorderColor: string
  pointHoverBorderWidth?: number
}

interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

// Data Grafik dengan pengikatan tipe
const chartData = ref<ChartData>({
  labels: ['Jan', 'Feb', 'March', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'This Period',
      data: [5200, 6800, 9500, 9300, 8400, 8000],
      borderColor: '#10b981', // emerald-500
      backgroundColor: 'rgba(16, 185, 129, 0.05)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#10b981',
      pointHoverBorderWidth: 2,
    },
    {
      label: 'Net Position',
      data: [4000, 5800, 6500, 6700, 6600, 6200],
      borderColor: '#e2e8f0', // slate-200
      borderWidth: 2,
      fill: false,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#cbd5e1',
    }
  ]
})

// Opsi Chart.js
// TypeScript akan meng-infer strukturnya, penggunaan Record<string, any> memastikan
// tidak ada error linter pada callback parameter bawaan Chart.js
const chartOptions = computed<Record<string, any>>(() => ({
  maintainAspectRatio: false,
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: '#ffffff',
      titleColor: '#0f172a',
      bodyColor: '#64748b',
      borderColor: '#f1f5f9',
      borderWidth: 1,
      padding: 12,
      boxPadding: 6,
      usePointStyle: true,
      callbacks: {
        title: () => '24 - 26 Apr 2025',
        label: (context: any) => {
          let label = context.dataset.label || '';
          if (label) {
            label += ' : ';
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0
            }).format(context.parsed.y);
          }
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false
      },
      ticks: {
        color: '#94a3b8',
        font: {
          family: 'Inter, sans-serif',
          weight: 500
        },
        callback: function (val: any) {
          // 'this' context di-handle oleh Chart.js, any digunakan untuk bypass strict TS check
          // @ts-ignore
          return this.getLabelForValue(val);
        }
      }
    },
    y: {
      min: 2000,
      max: 10000,
      grid: {
        color: '#f8fafc',
        drawBorder: false,
      },
      ticks: {
        color: '#94a3b8',
        stepSize: 2000,
        callback: (value: number) => {
          return '$' + (value / 1000) + 'k'
        }
      }
    }
  }
}))
</script>
