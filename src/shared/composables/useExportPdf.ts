/**
 * usePdfExport
 *
 * Composable Vue 3 untuk export PDF dengan dua strategi:
 *   1. exportViaprint()  — pure frontend, teks asli, lewat print dialog browser
 *   2. exportViaPuppeteer() — kirim HTML ke backend, download otomatis tanpa dialog
 */

import { ref } from 'vue'

export function usePdfExport() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // ----------------------------------------------------------------
  // STRATEGI 1: Pure Frontend — Print Dialog Browser
  //
  // Cara kerja:
  //   - Ambil innerHTML dari elemen template
  //   - Buka window baru, injeksi HTML + CSS
  //   - Panggil window.print() → user memilih "Save as PDF"
  //   - Teks di PDF adalah teks asli (bukan gambar)
  // ----------------------------------------------------------------

  /**
   * @param {HTMLElement} templateEl  - ref.$el dari komponen InvoiceTemplate
   * @param {string}      filename    - nama file (untuk judul tab saja, bukan nama PDF)
   */
  const exportViaPrint = (templateEl, filename = 'invoice') => {
    error.value = null

    // Kumpulkan semua <style> dari dokumen utama
    // agar CSS template (yang tidak scoped) ikut terbawa
    const styles = Array.from(document.querySelectorAll('style'))
      .map((s) => s.outerHTML)
      .join('\n')

    const html = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>${filename}</title>
        ${styles}
        <style>
          /* Paksa warna background tercetak */
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { size: A4; margin: 18mm 18mm; }
          body { margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        ${templateEl.innerHTML}
      </body>
      </html>
    `

    const printWindow = window.open('', '_blank', 'width=1000,height=700')

    if (!printWindow) {
      error.value = 'Pop-up diblokir browser. Izinkan pop-up untuk halaman ini.'
      return
    }

    printWindow.document.open()
    printWindow.document.write(html)
    printWindow.document.close()

    // Tunggu semua resource (font, gambar) selesai dimuat
    printWindow.onload = () => {
      printWindow.focus()
      printWindow.print()
      // Tutup window setelah dialog ditutup user
      printWindow.onafterprint = () => printWindow.close()
    }
  }

  // ----------------------------------------------------------------
  // STRATEGI 2: Backend Puppeteer — Download Otomatis
  //
  // Cara kerja:
  //   - Ambil innerHTML dari elemen template
  //   - Kirim HTML sebagai string ke endpoint backend (POST)
  //   - Backend (Express + Puppeteer) render HTML → return PDF binary
  //   - Frontend terima blob → trigger download otomatis
  //   - Teks di PDF adalah teks asli (Puppeteer pakai Chromium headless)
  // ----------------------------------------------------------------

  /**
   * @param {HTMLElement} templateEl     - ref.$el dari komponen InvoiceTemplate
   * @param {string}      filename       - nama file PDF yang didownload
   * @param {string}      backendUrl     - URL endpoint backend
   */
  const exportViaPuppeteer = async (
    templateEl,
    filename = 'invoice.pdf',
    backendUrl = 'http://localhost:3001/api/export-pdf'
  ) => {
    isLoading.value = true
    error.value = null

    try {
      // Kumpulkan CSS yang relevan (sama seperti strategi 1)
      const styles = Array.from(document.querySelectorAll('style'))
        .map((s) => s.outerHTML)
        .join('\n')

      const html = `
        <!DOCTYPE html>
        <html lang="id">
        <head>
          <meta charset="UTF-8">
          ${styles}
          <style>
            * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            body { margin: 0; padding: 0; }
          </style>
        </head>
        <body>
          ${templateEl.innerHTML}
        </body>
        </html>
      `

      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html,
          options: {
            format: 'A4',
            margin: { top: '18mm', bottom: '18mm', left: '18mm', right: '18mm' },
            printBackground: true, // penting agar background color ikut tercetak
          },
        }),
      })

      if (!response.ok) {
        const msg = await response.text()
        throw new Error(`Server error: ${msg}`)
      }

      // Terima response sebagai blob (binary PDF)
      const blob = await response.blob()

      // Buat URL sementara dan trigger download
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = filename
      anchor.click()

      // Bersihkan URL sementara
      URL.revokeObjectURL(url)
    } catch (err) {
      error.value = err.message
      console.error('[usePdfExport] Puppeteer export failed:', err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    exportViaPrint,
    exportViaPuppeteer,
  }
}
