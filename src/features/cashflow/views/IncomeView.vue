<script setup lang="ts">
import GenericTable from '@/shared/components/GenericTable.vue';
import { useCashflow } from '../composables/useCashflow';
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'
import GenericCard from '@/shared/components/GenericCard.vue';
import { rupiahFormatter } from '@/shared/utils/currencyFormater';

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

// const chartData = computed(() => {
//   // 1. Kelompokkan data berdasarkan tanggal (YYYY-MM-DD)
//   const groupedData: Record<string, number> = {};

//   if (!transactions.value){
//     return []
//   }

//   transactions.value.forEach((trx) => {
//     // Ambil bagian tanggalnya saja dari ISO string (misal: "2026-09-01")
//     const dateKey = trx.timestamp.split('T')[0];

//     // Tambahkan amount ke tanggal tersebut
//     if (!groupedData[dateKey]) {
//       groupedData[dateKey] = 0;
//     }
//     groupedData[dateKey] += trx.amount;
//   });

//   // 2. Urutkan tanggal dari yang terlama ke terbaru (opsional tapi sangat disarankan untuk chart)
//   const sortedDates = Object.keys(groupedData).sort();

//   // 3. Format label untuk sumbu X (misal dari "2026-09-01" menjadi "1 Sep 2026")
//   const labels = sortedDates.map(dateStr => {
//     return new Date(dateStr).toLocaleDateString('id-ID', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric'
//     });
//   });

//   // 4. Ambil array total amount yang sejajar dengan labels
//   const data = sortedDates.map(dateStr => groupedData[dateStr]);

//   // 5. Kembalikan format yang diterima Chart.js
//   return {
//     labels: labels,
//     datasets: [
//       {
//         label: 'Pemasukan',
//         data: data,
//         fill: true, // Ubah ke true jika ingin chart model Area
//         borderColor: '#10b981', // Warna hijau untuk pemasukan
//         backgroundColor: 'rgba(16, 185, 129, 0.1)',
//         tension: 0.4
//       }
//     ]
//   };
// });

</script>

<template>
  <div>
    <DatePicker v-model="filter" selectionMode="range" :hideOnRangeSelection="true" placeholder="Masukkan rentang waktu"
      @hide="fetchCashflow" />
    <GenericTable v-if="!isMobile" :data="transactions ?? []" :columns="incomeColumns" />
    <div v-else>
      <GenericCard v-for="transaction in transactions" :key="transaction.id" :id="transaction.id" :title="transaction.amount">
      </GenericCard>
    </div>
  </div>


</template>
