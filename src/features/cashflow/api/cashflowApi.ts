import { request } from '@/services/jsonServer.api';
import { CashflowReportResponseSchema, type CashflowReportResponse } from '../schemas/cashflow';

export const cashflowApi = {
  async getAllData(): Promise<CashflowReportResponse> {
    const response = await request('/cashflow');
    const validData = CashflowReportResponseSchema.parse(response);
    return validData;
  },
  async getIncomeData(): Promise<CashflowReportResponse> {
    const response = await request<CashflowReportResponse>('/cashflow/transactions?type=INCOME');
    const validData = CashflowReportResponseSchema.parse(response);
    return validData;
  },
  async getExpenseData(): Promise<CashflowReportResponse> {
    const response = await request<CashflowReportResponse>('/cashflow/transactions?type=EXPENSE');
    const validData = CashflowReportResponseSchema.parse(response);
    return validData;
  }
}
