<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCashflow } from '@/features/cashflow/composables/useCashflow';

const { filter, transactions: data, summary, isLoading, error, fetchCashflow, resetToBefore } = useCashflow();


const datePickerRef = ref();

const handleSubmit = async () => {
  await fetchCashflow('INCOME');

  if (!error.value) {
    const picker = datePickerRef.value as any; // Gunakan 'as any' untuk bypass TypeScript

    // Coba gunakan fungsi bawaan jika ada, atau paksa state visibilitasnya menjadi false
    if (picker && typeof picker.hideOverlay === 'function') {
      picker.hideOverlay();
    } else if (picker) {
      picker.overlayVisible = false;
    }
  } else {
    console.warn(error.value)
  }
};

// Sesuaikan tipe parameter dengan bawaan PrimeVue
const handleCancel = () => {
  const picker = datePickerRef.value as any; // Gunakan 'as any' untuk bypass TypeScript
  if (picker && typeof picker.hideOverlay === 'function') {
    picker.hideOverlay();
  } else if (picker) {
    picker.overlayVisible = false;
  }
  resetToBefore();
};

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


<template>
  <div class="w-full max-w-5xl bg-white p-6 rounded-2xl shadow-sm border border-slate-100">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h2 class="text-lg sm:text-xl font-semibold text-slate-800">Cash Flow Trend</h2>

      <DatePicker ref="datePickerRef" v-model="filter" selectionMode="range" :numberOfMonths="2"
        placeholder="Pilih rentang tanggal" showIcon iconDisplay="input" class="w-full sm:w-56" :invalid="!!error"
        showButtonBar :pt="{
          root: { class: ['text-sm', error ? 'border-red-500' : 'border-slate-200'] },
          input: { class: 'py-2 px-3 shadow-none text-slate-600' },
          panel: { class: 'p-0' }
        }">
        <!-- Slot buttonbar dengan scoped variable clearCallback -->
        <template #buttonbar="">
          <div class="flex justify-end gap-2 w-full p-3 border-t border-slate-200">
            <!-- Panggil clearCallback bawaan PrimeVue saat klik Cancel -->
            <Button label="Batal" severity="secondary" text @click="handleCancel" />

            <!-- Tombol Apply -->
            <Button label="Terapkan" @click="handleSubmit" />
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
      <Chart type="line" :data="data?.data" :options="chartOptions" class="h-full w-full" />
    </div>

  </div>
</template>
