import { ref, reactive, readonly } from 'vue'
import type { CashflowSummaryResponse, Transaction } from '../schemas/cashflow.schema'
import { cashflowApi } from '../api/cashflowApi'
import { DateRangeSchema } from '../schemas/dateRange'
import type { TransactionType } from '../schemas/cashflow.schema'

// Asumsi Anda memiliki fungsi API ini di folder api/
// import { getCashflowReport } from '../api/cashflow.api';

export function useCashflow() {
  // 1. Reactive State
  // Gunakan `reactive` untuk form filter agar mudah diikat (v-model) di template
  const dateRange = ref<Date[]>([])

  // Gunakan `ref` untuk state eksekusi dan hasil data
  const transactions = ref<Transaction[] | null>(null)
  const summary = ref<CashflowSummaryResponse | null>(null)
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  let oldDateRange: Date[] = []

  // 2. Actions / Methods
  const fetchCashflow = async (transactionType?: TransactionType) => {
    if (!dateRange.value[0] || !dateRange.value[1]) {
      resetToBefore()
      return
    }
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
      transactions.value = (await cashflowApi.getTransactions({ ...result.data, transactionType })).data
      summary.value = await cashflowApi.getSummary(result.data)
    } catch (err) {
      // Tangkap error dari Axios/Fetch dan tampilkan pesan yang ramah pengguna
      const errorMessage = err instanceof Error ? err.message : 'Gagal mengambil data arus kas.'
      error.value = errorMessage
      transactions.value = null
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
    transactions: readonly(transactions),
    summary: readonly(summary),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Actions
    fetchCashflow,
  }
}
