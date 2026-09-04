import { ref, reactive, readonly } from 'vue'
import type { CashflowReportResponse } from '../schemas/cashflow'
import { cashflowApi } from '../api/cashflowApi'
import { DateRangeSchema } from '../schemas/dateRange'

// Asumsi Anda memiliki fungsi API ini di folder api/
// import { getCashflowReport } from '../api/cashflow.api';

export function useCashflow() {
  // 1. Reactive State
  // Gunakan `reactive` untuk form filter agar mudah diikat (v-model) di template
  const dateRange = ref<Date[]>([])

  // Gunakan `ref` untuk state eksekusi dan hasil data
  const data = ref<CashflowReportResponse | null>(null)
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  let oldDateRange: Date[] = [];

  // 2. Actions / Methods
  const fetchCashflow = async () => {
    const result = DateRangeSchema.safeParse(dateRange.value)
    if (!result.success) {
      error.value = result.error.message
      return
    }
    oldDateRange = dateRange.value
    isLoading.value = true
    error.value = null

    try {
      // data.value = await cashflowApi.getFilteredReport(result.data.startDate, result.data.endDate) // Panggil API untuk mengambil data arus kas
      // untuk sementara gunakan ini
      data.value = await cashflowApi.getAllData()
    } catch (err) {
      // Tangkap error dari Axios/Fetch dan tampilkan pesan yang ramah pengguna
      const errorMessage = err instanceof Error ? err.message : 'Gagal mengambil data arus kas.'
      error.value = errorMessage
      data.value = null
    } finally {
      isLoading.value = false
    }
  }

  const fetchIncome = async () => {
    const result = DateRangeSchema.safeParse(dateRange.value)
    if (!result.success) {
      error.value = result.error.message
      return
    }
    oldDateRange = dateRange.value
    isLoading.value = true
    error.value = null

    try {
      // data.value = await cashflowApi.getFilteredReport(result.data.startDate, result.data.endDate) // Panggil API untuk mengambil data arus kas
      // untuk sementara gunakan ini
      data.value = await cashflowApi.getIncomeData()
    } catch (err) {
      // Tangkap error dari Axios/Fetch dan tampilkan pesan yang ramah pengguna
      const errorMessage = err instanceof Error ? err.message : 'Gagal mengambil data arus kas.'
      error.value = errorMessage
      data.value = null
    } finally {
      isLoading.value = false
    }
  }

  const resetToBefore = () => {
    dateRange.value = oldDateRange
    error.value = null
  }

  // 3. Expose State & Actions
  return {
    // State
    filter: dateRange,
    // Gunakan readonly untuk mencegah komponen UI mengubah data secara langsung tanpa melalui action
    data: readonly(data),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Actions
    fetchCashflow,
    resetToBefore
  }
}
