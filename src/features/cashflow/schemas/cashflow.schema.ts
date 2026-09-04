import {z} from 'zod';

export const TransactionSchema = z.object({
  id: z.string(),
  transaction_id: z.string(),
  type: z.enum(['INCOME', 'EXPENSE']),
  amount: z.number(),
  category: z.string(),
  description: z.string(),
  payment_method: z.string(),
  timestamp: z.string().datetime(),
});

export const CashflowSummarySchema = z.object({
  totalIncome: z.number(),
  totalExpense: z.number(),
  balance: z.number(),
});

export const CashflowReportResponseSchema = z.object({
  summary: CashflowSummarySchema,
  transactions: z.array(TransactionSchema),
});

export type CashflowReportResponse = z.infer<typeof CashflowReportResponseSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
export type CashflowSummary = z.infer<typeof CashflowSummarySchema>;
