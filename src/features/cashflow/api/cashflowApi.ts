import { request } from '@/services/jsonServer.api'
import {
  CashflowSummaryResponseSchema,
  TransactionListResponseSchema,
  type CashflowSummaryResponse,
  type TransactionListResponse,
} from '../schemas/cashflow.schema'
import type { CashflowPeriodFilter, TransactionQueryParams } from '../types/cashflow.types'

function buildQueryParams(params?: object): string {
  if (!params) return '';

  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      urlParams.append(key, String(value));
    }
  });

  const queryString = urlParams.toString();
  return queryString ? `?${queryString}` : '';
}

export const cashflowApi = {
  async getTransactions(params?: TransactionQueryParams): Promise<TransactionListResponse> {
    const queryString = buildQueryParams(params)  // ✅ tidak perlu cast
    const url = `/cashflow/transactions${queryString}`

    const response = await request(url)
    return TransactionListResponseSchema.parse(response)
  },

  async getSummary(params?: CashflowPeriodFilter): Promise<CashflowSummaryResponse> {
    const queryString = buildQueryParams(params)  // ✅ tidak perlu cast
    const url = `/cashflow/summary${queryString}`

    const response = await request(url)
    return CashflowSummaryResponseSchema.parse(response)
  },
}
