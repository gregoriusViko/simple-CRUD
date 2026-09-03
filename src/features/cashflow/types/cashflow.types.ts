// Menghindari magic string, gunakan Literal Type agar TypeScript bisa memberikan autocomplete yang ketat
export type TransactionType = 'INCOME' | 'EXPENSE';

// Tipe untuk state filter atau payload request ke API
export interface CashflowPeriodFilter {
  startDate: string; // Ekspektasi format: 'YYYY-MM-DD'
  endDate: string;   // Ekspektasi format: 'YYYY-MM-DD'
}

// Representasi satu baris data transaksi (Pemasukan/Pengeluaran)
export interface Transaction {
  id: string;
  transaction_id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  payment_method: string;
  timestamp: string; // ISO 8601 string

}

// Representasi agregasi/ringkasan data di periode tersebut
export interface CashflowSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

// Representasi bentuk kembalian (response) dari Backend API
export interface CashflowReportResponse {
  summary: CashflowSummary;
  transactions: Transaction[];
}
