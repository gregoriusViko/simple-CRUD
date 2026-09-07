<script setup lang="ts">
import GenericTable from '@/shared/components/GenericTable.vue';
import { useCashflow } from '../composables/useCashflow';
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'
import GenericCard from '@/shared/components/GenericCard.vue';
import { rupiahFormatter } from '@/shared/utils/currencyFormater';
import { ref, computed } from 'vue';

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

const maxDate = ref(new Date());

const chartData = computed(() => {
  // Jika data kosong/null, kembalikan struktur object kosong yang valid
  if (!transactions.value || transactions.value.length === 0) {
    return {
      labels: [],
      datasets: []
    };
  }

  // 1. Kelompokkan data berdasarkan tanggal (YYYY-MM-DD)
  const groupedData: Record<string, number> = {};

  transactions.value.forEach((trx) => {
    const dateKey = trx.timestamp.split('T')[0];

    if (dateKey) {
      if (!groupedData[dateKey]) {
        groupedData[dateKey] = 0;
      }
      groupedData[dateKey] += trx.amount;
    }
  });

  // 2. Urutkan tanggal dari terlama ke terbaru
  const sortedDates = Object.keys(groupedData).sort();

  // 3. Format label sumbu X (tambahkan T00:00:00 agar dibaca sebagai waktu lokal)
  const labels = sortedDates.map(dateStr => {
    return new Date(`${dateStr}T00:00:00`).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  });

  // 4. Ambil array total amount
  const data = sortedDates.map(dateStr => groupedData[dateStr]);

  // 5. Kembalikan format untuk Chart.js
  return {
    labels: labels,
    datasets: [
      {
        label: 'Pemasukan',
        data: data,
        fill: true,
        borderColor: '#10b981',
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
        // Hapus callback title agar otomatis menggunakan tanggal titik data tersebut
        label: (context: any) => {
          let label = context.dataset.label || '';
          if (label) {
            label += ' : ';
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
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
        }
      }
    },
    y: {
      // Hapus min/max/stepSize agar chart menyesuaikan dengan rentang angka transaksi secara dinamis
      grid: {
        color: '#f8fafc',
        drawBorder: false,
      },
      ticks: {
        color: '#94a3b8',
        callback: (value: number) => {
          return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
          }).format(value);
        }
      }
    }
  }
}));
</script>

<template>
  <div>
    <DatePicker
      v-model="filter"
      selectionMode="range"
      :hideOnRangeSelection="true"
      placeholder="Masukkan rentang waktu"
      @hide="fetchCashflow"
      :maxDate="maxDate"
    />
    <GenericTable v-if="!isMobile" :data="transactions ?? []" :columns="incomeColumns" />
    <div v-else>
      <GenericCard
        v-for="transaction in transactions"
        :key="transaction.id"
        :id="transaction.id"
        :title="transaction.amount"
      />
    </div>
  </div>
  <div>
    <Chart type="line" :data="chartData" :options="chartOptions" class="h-full w-full" />
  </div>
</template>
