import { request } from '@/services/jsonServer.api';
import { CashflowReportResponseSchema, type CashflowReportResponse } from '../schemas/cashflow';

export const cashflowApi = {
  async getAllData(): Promise<CashflowReportResponse> {
    const response = await request('/cashflows');
    const validData = CashflowReportResponseSchema.parse(response);
    return validData;
  },
  async getFilteredReport(startDate: string, endDate: string): Promise<CashflowReportResponse> {
    const response = await request<CashflowReportResponse>(`/cashflows/transactions?startDate=${startDate}&endDate=${endDate}`);
    const validData = CashflowReportResponseSchema.parse(response);
    return validData;
  },
  async getIncomeData(): Promise<CashflowReportResponse> {
    const response = await request<CashflowReportResponse>('/cashflows/transactions?type=INCOME');
    const validData = CashflowReportResponseSchema.parse(response);
    return validData;
  },
  async getExpenseData(): Promise<CashflowReportResponse> {
    const response = await request<CashflowReportResponse>('/cashflows/transactions?type=EXPENSE');
    const validData = CashflowReportResponseSchema.parse(response);
    return validData;
  }
}
