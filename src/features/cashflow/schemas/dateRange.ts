import { z } from 'zod';
import type { CashflowPeriodFilter } from '../types/cashflow.types';

// Helper agar tanggal tidak mundur 1 hari ke UTC
const toLocalYYYYMMDD = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const DateRangeSchema = z
  // Menggunakan array seperti asli buatan Anda, agar cocok dengan PrimeVue
  .array(z.date())
  .length(2, { message: 'Data range harus terdiri dari 2 tanggal.' })
  .transform((dates) => {
    // Penggunaan '!' di sini SANGAT AMAN karena sudah dijaga oleh .length(2) di atas
    const startDate = dates[0]!;
    const endDate = dates[1]!;

    return {
      startDate: toLocalYYYYMMDD(startDate),
      endDate: toLocalYYYYMMDD(endDate)
    } as CashflowPeriodFilter;
  });
