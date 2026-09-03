// Tipe untuk state filter atau payload request ke API
export interface CashflowPeriodFilter {
  startDate: string; // Ekspektasi format: 'YYYY-MM-DD'
  endDate: string;   // Ekspektasi format: 'YYYY-MM-DD'
}
