<script setup lang="ts">
import GenericTable from '@/shared/components/GenericTable.vue';
import { useCashflow } from '../composables/useCashflow';
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'
import GenericCard from '@/shared/components/GenericCard.vue';
import { rupiahFormatter } from '@/shared/utils/currencyFormater';
import { computed } from 'vue';

const breakpoints = useBreakpoints(breakpointsTailwind)

const isMobile = breakpoints.smaller('sm')

const { transactions, summary, error, filter, isLoading, fetchCashflow } = useCashflow()

const incomeColumns = [
  { field: 'category', header: 'Categori', sortable: true },
  { field: 'amount', header: 'Jumlah', sortable: true, formatter: rupiahFormatter },
  { field: 'description', header: 'Deskripsi', sortable: true },
  { field: 'paymentMethod', header: 'Metode Pembayaran', sortable: true },
  { field: 'timestamp', header: 'Tanggal', sortable: true },
]

const chartData = computed(() => {
  // 1. Kelompokkan data berdasarkan tanggal (YYYY-MM-DD)
  const groupedData: Record<string, number> = {};

  if (!transactions.value) {
    return []
  }

  transactions.value.forEach((trx) => {
    // Ambil bagian tanggalnya saja dari ISO string (misal: "2026-09-01")
    const dateKey = trx.timestamp.split('T')[0];

    // Tambahkan amount ke tanggal tersebut
    if (dateKey) {
      if (!groupedData[dateKey]) {
        groupedData[dateKey] = 0;
      }
      groupedData[dateKey] += trx.amount;
    }
  });

  // 2. Urutkan tanggal dari yang terlama ke terbaru (opsional tapi sangat disarankan untuk chart)
  const sortedDates = Object.keys(groupedData).sort();

  // 3. Format label untuk sumbu X (misal dari "2026-09-01" menjadi "1 Sep 2026")
  const labels = sortedDates.map(dateStr => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  });

  // 4. Ambil array total amount yang sejajar dengan labels
  const data = sortedDates.map(dateStr => groupedData[dateStr]);

  // 5. Kembalikan format yang diterima Chart.js
  return {
    labels: labels,
    datasets: [
      {
        label: 'Pemasukan',
        data: data,
        fill: true, // Ubah ke true jika ingin chart model Area
        borderColor: '#10b981', // Warna hijau untuk pemasukan
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4
      }
    ]
  };
});

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
  <div>
    <DatePicker v-model="filter" selectionMode="range" :hideOnRangeSelection="true" placeholder="Masukkan rentang waktu"
      @hide="fetchCashflow" />
    <GenericTable v-if="!isMobile" :data="transactions ?? []" :columns="incomeColumns" />
    <div v-else>
      <GenericCard v-for="transaction in transactions" :key="transaction.id" :id="transaction.id"
        :title="transaction.amount">
      </GenericCard>
    </div>
  </div>
  <div>
    <Chart type="line" :data="chartData" :options="chartOptions" class="h-full w-full" />
  </div>


</template>
