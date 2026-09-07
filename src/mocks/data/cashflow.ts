// File: mocks/data/cashflow.ts

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
  timestamp: string;
  category: string;
  paymentMethod: string;
}

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'INCOME',
    amount: 15000000,
    description: 'Gaji September',
    date: '2026-09-01',
    // --- Tambahan baru di bawah ini ---
    timestamp: '2026-09-01T08:00:00Z',
    category: 'Gaji',
    paymentMethod: 'Transfer Bank'
  },
  {
    id: '2',
    type: 'EXPENSE',
    amount: 150000,
    description: 'Belanja Bulanan',
    date: '2026-09-02',
    timestamp: '2026-09-02T10:30:00Z',
    category: 'Kebutuhan Harian',
    paymentMethod: 'Kartu Debit'
  },
  {
    id: '3',
    type: 'EXPENSE',
    amount: 50000,
    description: 'Bensin',
    date: '2026-09-05',
    timestamp: '2026-09-05T07:15:00Z',
    category: 'Transportasi',
    paymentMethod: 'Tunai'
  },
  {
    id: '4',
    type: 'INCOME',
    amount: 2000000,
    description: 'Bonus Proyek',
    date: '2026-09-10',
    timestamp: '2026-09-10T14:00:00Z',
    category: 'Bonus',
    paymentMethod: 'Transfer Bank'
  },
  {
    id: '5',
    type: 'EXPENSE',
    amount: 300000,
    description: 'Tagihan Listrik',
    date: '2026-09-12',
    timestamp: '2026-09-12T09:00:00Z',
    category: 'Tagihan',
    paymentMethod: 'E-Wallet'
  },
];
