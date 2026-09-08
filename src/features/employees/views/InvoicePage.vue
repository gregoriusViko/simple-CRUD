<template>
  <div class="page">

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="toolbar-left">
        <h2 class="toolbar-title">Invoice #{{ invoiceData.invoiceNumber }}</h2>
        <span class="toolbar-badge">Preview</span>
      </div>
      <div class="toolbar-actions">
        <!-- Tombol 1: Export via print dialog (pure frontend) -->
        <button
          class="btn btn-secondary"
          :disabled="isLoading"
          @click="handlePrintExport"
        >
          <span class="btn-icon">🖨️</span>
          Print / Save PDF
        </button>

        <!-- Tombol 2: Export via Puppeteer (download otomatis) -->
        <button
          class="btn btn-primary"
          :disabled="isLoading"
          @click="handlePuppeteerExport"
        >
          <span class="btn-icon">{{ isLoading ? '⏳' : '⬇️' }}</span>
          {{ isLoading ? 'Generating...' : 'Download PDF' }}
        </button>
      </div>
    </div>

    <!-- Pesan error -->
    <div v-if="error" class="error-banner">
      ⚠️ {{ error }}
    </div>

    <!-- Keterangan perbedaan dua tombol -->
    <div class="info-row">
      <div class="info-item">
        <strong>Print / Save PDF</strong> — membuka print dialog browser.
        Pilih "Save as PDF". Teks di PDF tetap asli.
      </div>
      <div class="info-item">
        <strong>Download PDF</strong> — memerlukan backend aktif di
        <code>localhost:3001</code>. File langsung terdownload tanpa dialog.
      </div>
    </div>

    <!-- Preview template (yang akan di-render ke PDF) -->
    <div class="preview-container">
      <InvoiceTemplate ref="templateRef" :data="invoiceData" />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InvoiceTemplate from '../components/InvoiceTemplate.vue'
import { usePdfExport } from '@/shared/composables/useExportPdf.ts'

// ── Data invoice — di proyek nyata ini datang dari API / Pinia store ──
const invoiceData = ref({
  invoiceNumber: 'INV-2024-0042',
  date: '08 September 2024',
  dueDate: '22 September 2024',
  taxRate: 11,

  company: {
    name: 'PT. Karya Digital Nusantara',
    address: 'Jl. Pemuda No. 88, Semarang 50132',
    npwp: '01.234.567.8-900.000',
  },

  client: {
    name: 'Budi Santoso, S.Kom',
    address: 'Jl. Pahlawan No. 45, Semarang',
    email: 'budi.santoso@email.com',
  },

  items: [
    { description: 'Jasa Pengembangan Website', qty: 1, price: 8_000_000 },
    { description: 'Desain UI/UX Aplikasi', qty: 1, price: 3_500_000 },
    { description: 'Maintenance & Support', qty: 3, price: 500_000 },
  ],

  payment: {
    bank: 'BCA',
    accountNumber: '1234567890',
    accountName: 'PT. Karya Digital Nusantara',
  },

  notes: 'Harap konfirmasi setelah melakukan pembayaran. Terima kasih atas kepercayaan Anda.',
})

// ── Ref ke komponen template ──────────────────────────────────────────
const templateRef = ref<InstanceType<typeof InvoiceTemplate> | null>(null)

// ── Composable export ─────────────────────────────────────────────────
const { isLoading, error, exportViaPrint, exportViaPuppeteer } = usePdfExport()

// ── Handler tombol ────────────────────────────────────────────────────

const handlePrintExport = () => {
  // templateRef.value.$el adalah DOM element dari <InvoiceTemplate>
  if (templateRef.value){
    exportViaPrint(templateRef.value.$el, `invoice-${invoiceData.value.invoiceNumber}`);
  }else{
    console.error('gagal, template kosong');
  }
}

const handlePuppeteerExport = () => {
  exportViaPuppeteer(
    templateRef.value.$el,
    `invoice-${invoiceData.value.invoiceNumber}.pdf`,
    'http://localhost:3001/api/export-pdf'  // ganti sesuai URL backend Anda
  )
}
</script>

<style scoped>
.page {
  max-width: 860px;
  margin: 0 auto;
  padding: 24px 16px;
  font-family: system-ui, sans-serif;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 12px;
  flex-wrap: wrap;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toolbar-title {
  font-size: 18px;
  font-weight: 600;
  color: #111;
  margin: 0;
}

.toolbar-badge {
  font-size: 11px;
  background: #e8effe;
  color: #1a56db;
  border-radius: 20px;
  padding: 2px 10px;
  font-weight: 500;
}

.toolbar-actions {
  display: flex;
  gap: 10px;
}

.btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: opacity 0.15s, background 0.15s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #fff;
  border-color: #d1d5db;
  color: #374151;
}

.btn-secondary:hover:not(:disabled) {
  background: #f9fafb;
}

.btn-primary {
  background: #1a56db;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: #1648c0;
}

.btn-icon {
  font-size: 14px;
}

.error-banner {
  background: #fef2f2;
  border: 1px solid #fca5a5;
  color: #991b1b;
  border-radius: 6px;
  padding: 10px 14px;
  font-size: 13px;
  margin-bottom: 14px;
}

.info-row {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.info-item {
  flex: 1;
  min-width: 200px;
  font-size: 12px;
  color: #6b7280;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 10px 12px;
  line-height: 1.6;
}

.info-item code {
  font-family: monospace;
  font-size: 11px;
  background: #e5e7eb;
  padding: 1px 5px;
  border-radius: 3px;
}

.preview-container {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.07);
  overflow: hidden;
}
</style>
