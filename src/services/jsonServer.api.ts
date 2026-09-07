import { ofetch } from 'ofetch'

const API_URL = 'http://localhost:3000/api'

export const request = ofetch.create({
  baseURL: API_URL,
  timeout: 12000, // ofetch menangani AbortController di balik layar

  async onRequest({ options }) {
    const token = localStorage.getItem('access_token')
    if (token) {
      // 1. Pastikan options.headers dikonversi menjadi instance Headers
      options.headers = new Headers(options.headers || {})

      // 2. Gunakan metode .set() bawaan dari standar Fetch API
      options.headers.set('Authorization', `Bearer ${token}`)
    }
  },

  // Interceptor: Menangani error jaringan atau timeout (tidak ada respons)
  async onRequestError({ error }) {
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      throw new Error('DummyJSON terlalu lama merespons. Silakan coba lagi.')
    }
    throw new Error('Tidak dapat terhubung ke DummyJSON.')
  },

  // Interceptor: Menangani HTTP Error (status 400-599)
  async onResponseError({ response }) {
    // Otomatis menolak respons HTML yang nyasar, tidak akan crash karena JSON parsing
    throw new Error(`Permintaan gagal dengan status ${response.status}`)
  },
})
