import { request } from '@/services/jsonServer.api';
import type { CashflowReportResponse } from '../types/cashflow.types';

export const cashflowApi = {
  async getAllData(): Promise<CashflowReportResponse> {
    const response = await request<CashflowReportResponse>('/cashflow');
    return response;
  },
  async getIncomeData(): Promise<CashflowReportResponse> {
    const response = await request<CashflowReportResponse>('/cashflow/transactions?type=INCOME');
    return response;
  }
}

const incomeApi = {
  async getAll() {
    const response = await request<CashflowReportResponse>('/cashflow/transactions?type=INCOME');
    return response;
  }
}
