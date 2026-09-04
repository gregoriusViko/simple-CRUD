import {z} from 'zod';

export const TransactionSchema = z.object({
  // id: z.string(),
  transaction_id: z.string(),
  type: z.enum(['income', 'expense']),
  amount: z.number(),
  category: z.string(),
  description: z.string(),
  payment_method: z.string(),
  timestamp: z.string().datetime({ offset: true }),
});

export const CashflowReportResponseSchema = z.object({
  totalIncome: z.number(),
  totalExpense: z.number(),
  balance: z.number(),
  transactions: z.array(TransactionSchema),
});

export type CashflowReportResponse = z.infer<typeof CashflowReportResponseSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
