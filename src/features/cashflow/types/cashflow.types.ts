import type { TransactionType } from "../schemas/cashflow.schema";

// Tipe untuk state filter atau payload request ke API
export interface CashflowPeriodFilter {
  startDate: string; // Ekspektasi format: 'YYYY-MM-DD'
  endDate: string;   // Ekspektasi format: 'YYYY-MM-DD'
}

// Menggunakan intersection type (&) sebagai pengganti extends
export interface TransactionQueryParams extends Partial<CashflowPeriodFilter> {
  transactionType?: TransactionType
};
