import { request } from '@/services/jsonServer.api';
import { CashflowReportResponseSchema, type CashflowReportResponse } from '../schemas/cashflow.schema';
import type { CashflowPeriodFilter } from '../types/cashflow.types'

export interface TransactionQueryParams extends Partial<CashflowPeriodFilter> {
  type?: "INCOME" | "EXPENSE"
}

async function fetchAndValidate(endpoint: string): Promise <CashflowReportResponse> {
  const response = await request(endpoint);
  return CashflowReportResponseSchema.parse(response)
}

export const cashflowApi = {
  async getAllData() : Promise<CashflowReportResponse> {
    return fetchAndValidate('/cashflows');
  },

  async getTransactions(params?: TransactionQueryParams): Promise<CashflowReportResponse>{
    const urlParams = new URLSearchParams()

    if(params?.startDate) urlParams.append('startDate', params.startDate);
    if(params?.endDate) urlParams.append('endDate', params.endDate);
    if(params?.type) urlParams.append('type', params.type);

    const queryString = urlParams.toString()
    const endpoint =queryString
    ? `/cashflows/transactions?${queryString}`
    : 'cashflows/transactions';

    return fetchAndValidate(endpoint);
  }
}
