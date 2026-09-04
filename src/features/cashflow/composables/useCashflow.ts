import { ref, reactive, readonly } from 'vue'
import type { CashflowPeriodFilter } from '../types/cashflow.types'
import type { CashflowReportResponse } from '../schemas/cashflow.schema'

// Asumsi Anda memiliki fungsi API ini di folder api/
// import { getCashflowReport } from '../api/cashflow.api';

export function useCashflow() {
  // 1. Reactive State
  // Gunakan `reactive` untuk form filter agar mudah diikat (v-model) di template
  const filter = reactive<CashflowPeriodFilter>({
    startDate: '',
    endDate: '',
  })

  // Gunakan `ref` untuk state eksekusi dan hasil data
  const data = ref<CashflowReportResponse | null>(null)
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // 2. Actions / Methods
  const fetchCashflow = async () => {
    // Validasi pencegahan di sisi klien sebelum membuang *resource* ke backend
    if (!filter.startDate || !filter.endDate) {
      error.value = 'Tanggal mulai dan tanggal akhir wajib diisi.'
      return
    }

    isLoading.value = true
    error.value = null

    try {
      // Pemanggilan layer API yang sebenarnya (di-uncomment pada implementasi asli)
      // const response = await getCashflowReport({
      //   startDate: filter.startDate,
      //   endDate: filter.endDate
      // });

      // Simulasi delay untuk contoh
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Assign hasil HTTP Request ke state internal
      data.value = {
        summary: { totalIncome: 15000000, totalExpense: 5000000, balance: 10000000 },
        transactions: [],
      } // Ganti dengan `data.value = response;`
    } catch (err) {
      // Tangkap error dari Axios/Fetch dan tampilkan pesan yang ramah pengguna
      const errorMessage = err instanceof Error ? err.message : 'Gagal mengambil data arus kas.'
      error.value = errorMessage
      data.value = null
    } finally {
      isLoading.value = false
    }
  }

  const resetFilter = () => {
    filter.startDate = ''
    filter.endDate = ''
    data.value = null
    error.value = null
  }

  // 3. Expose State & Actions
  return {
    // State
    filter,
    // Gunakan readonly untuk mencegah komponen UI mengubah data secara langsung tanpa melalui action
    data: readonly(data),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Actions
    fetchCashflow,
    resetFilter,
  }
}
