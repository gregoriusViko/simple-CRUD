import { z } from 'zod';
import type { CashflowPeriodFilter } from '../types/cashflow.types';

export const DateRangeSchema = z.array(z.date()).length(2, { message: 'Data range harus terdiri dari 2 tanggal.' }).transform((dates) => {
  const [startDate, endDate] = dates;
  return { startDate: startDate!.toISOString(), endDate: endDate!.toISOString() } as CashflowPeriodFilter;
});
