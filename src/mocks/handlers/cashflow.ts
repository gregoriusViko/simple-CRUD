// File: mocks/handlers/cashflow.ts

import { http, HttpResponse } from 'msw'
import { mockTransactions, type Transaction } from '../data/cashflow'

const BASE_URL = 'http://localhost:3000'

export const cashflowHandlers = [
  // 1. Handler untuk mendapatkan list transaksi dengan Filter
  http.get(`${BASE_URL}/api/cashflow/transactions`, ({ request }) => {
    // Ambil URL dan Query Parameters dari request
    const url = new URL(request.url)
    const startDate = url.searchParams.get('startDate')
    const endDate = url.searchParams.get('endDate')
    const type = url.searchParams.get('transactionType')

    let filteredData: Transaction[] = [...mockTransactions]

    // Filter berdasarkan Transaction Type (Jika dikirim)
    if (type) {
      filteredData = filteredData.filter((t) => t.type === type)
    }

    // Filter berdasarkan Start Date
    if (startDate) {
      filteredData = filteredData.filter((t) => new Date(t.date) >= new Date(startDate))
    }

    // Filter berdasarkan End Date
    if (endDate) {
      filteredData = filteredData.filter((t) => new Date(t.date) <= new Date(endDate))
    }

    // Mengembalikan data sesuai struktur TransactionListResponse Anda
    return HttpResponse.json({
      success: true,
      data: filteredData,
      total: filteredData.length,
    })
  }),

  // 2. Handler untuk mendapatkan kalkulasi Summary
  http.get(`${BASE_URL}/api/cashflow/summary`, ({ request }) => {
    const url = new URL(request.url)
    const startDate = url.searchParams.get('startDate')
    const endDate = url.searchParams.get('endDate')

    let filteredData: Transaction[] = [...mockTransactions]

    // Terapkan filter tanggal (sama seperti di atas)
    if (startDate) {
      filteredData = filteredData.filter((t) => new Date(t.date) >= new Date(startDate))
    }
    if (endDate) {
      filteredData = filteredData.filter((t) => new Date(t.date) <= new Date(endDate))
    }

    // Kalkulasi Total Pemasukan dan Pengeluaran
    const totalIncome = filteredData
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, current) => sum + current.amount, 0)

    const totalExpense = filteredData
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, current) => sum + current.amount, 0)

    const balance = totalIncome - totalExpense

    // Mengembalikan data sesuai struktur CashflowSummaryResponse Anda
    return HttpResponse.json({
      success: true,
      totalIncome: totalIncome,
      totalExpense: totalExpense,
      balance: balance,
    })
  }),
]
