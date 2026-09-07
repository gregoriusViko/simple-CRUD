import { z } from 'zod'

// 1. Ini adalah SSOT Anda (Sumber Kebenaran)
export const TransactionTypeEnum = z.enum(['INCOME', 'EXPENSE']);

// 2. Ekstrak tipe TypeScript-nya secara otomatis!
// Hasilnya sama persis seperti: type TransactionType = 'INCOME' | 'EXPENSE'
export type TransactionType = z.infer<typeof TransactionTypeEnum>;

export const TransactionSchema = z.object({
  id: z.string(),
  type: TransactionTypeEnum,
  amount: z.number(),
  category: z.string(),
  description: z.string(),
  paymentMethod: z.string(),
  timestamp: z.string().datetime({ offset: true }),
})

export const TransactionListResponseSchema = z.object({
  data: z.array(TransactionSchema),
})

export const CashflowSummaryResponseSchema = z.object({
  totalIncome: z.number(),
  totalExpense: z.number(),
  balance: z.number(),
})

export type Transaction = z.infer<typeof TransactionSchema>
export type TransactionListResponse = z.infer<typeof TransactionListResponseSchema>
export type CashflowSummaryResponse = z.infer<typeof CashflowSummaryResponseSchema>
