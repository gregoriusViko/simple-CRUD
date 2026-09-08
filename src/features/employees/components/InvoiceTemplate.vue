<template>
  <div class="invoice">

    <div class="inv-header">
      <div class="inv-from">
        <div class="inv-company">{{ data.company.name }}</div>
        <div class="inv-company-detail">{{ data.company.address }}</div>
        <div class="inv-company-detail">NPWP: {{ data.company.npwp }}</div>
      </div>
      <div class="inv-meta">
        <h1 class="inv-title">INVOICE</h1>
        <table class="inv-meta-table">
          <tbody>
            <tr><td>No</td><td>: {{ data.invoiceNumber }}</td></tr>
            <tr><td>Tanggal</td><td>: {{ data.date }}</td></tr>
            <tr><td>Jatuh Tempo</td><td>: {{ data.dueDate }}</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="inv-parties">
      <div class="inv-party">
        <div class="inv-party-label">Tagihan Kepada</div>
        <div class="inv-party-name">{{ data.client.name }}</div>
        <div class="inv-party-detail">{{ data.client.address }}</div>
        <div class="inv-party-detail">{{ data.client.email }}</div>
      </div>
    </div>

    <table class="inv-table">
      <thead>
        <tr>
          <th style="width: 5%">No</th>
          <th style="width: 45%">Deskripsi</th>
          <th style="width: 10%; text-align:right">Qty</th>
          <th style="width: 20%; text-align:right">Harga Satuan</th>
          <th style="width: 20%; text-align:right">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in data.items" :key="i">
          <td>{{ i + 1 }}</td>
          <td>{{ item.description }}</td>
          <td style="text-align:right">{{ item.qty }}</td>
          <td style="text-align:right">{{ formatRupiah(item.price) }}</td>
          <td style="text-align:right">{{ formatRupiah(item.qty * item.price) }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="subtotal-row">
          <td colspan="4" style="text-align:right">Subtotal</td>
          <td style="text-align:right">{{ formatRupiah(subtotal) }}</td>
        </tr>
        <tr class="tax-row">
          <td colspan="4" style="text-align:right">PPN ({{ data.taxRate }}%)</td>
          <td style="text-align:right">{{ formatRupiah(tax) }}</td>
        </tr>
        <tr class="total-row">
          <td colspan="4" style="text-align:right">TOTAL</td>
          <td style="text-align:right">{{ formatRupiah(total) }}</td>
        </tr>
      </tfoot>
    </table>

    <div class="inv-footer">
      <div class="inv-bank">
        <div class="inv-bank-label">Informasi Pembayaran</div>
        <div>Bank {{ data.payment.bank }} — {{ data.payment.accountNumber }}</div>
        <div>a/n {{ data.payment.accountName }}</div>
      </div>
      <div class="inv-notes">{{ data.notes }}</div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const subtotal = computed(() =>
  props.data.items.reduce((sum, item) => sum + item.qty * item.price, 0)
)

const tax = computed(() =>
  (subtotal.value * props.data.taxRate) / 100
)

const total = computed(() => subtotal.value + tax.value)

const formatRupiah = (value) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)
</script>

<!--
  PENTING: style tidak pakai "scoped" agar CSS bisa dibaca
  saat innerHTML dikirim ke print window atau ke Puppeteer.
-->
<style>
.invoice {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
  color: #1a1a1a;
  padding: 36px 40px;
  background: #fff;
}

.inv-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 2.5px solid #1a56db;
}

.inv-company {
  font-size: 17px;
  font-weight: bold;
  color: #1a56db;
  margin-bottom: 4px;
}

.inv-company-detail {
  font-size: 11px;
  color: #555;
  line-height: 1.6;
}

.inv-meta { text-align: right; }

.inv-title {
  font-size: 26px;
  font-weight: bold;
  color: #1a56db;
  letter-spacing: 3px;
  margin-bottom: 8px;
}

.inv-meta-table td {
  font-size: 11px;
  color: #555;
  padding: 1px 4px;
}

.inv-parties {
  margin-bottom: 24px;
}

.inv-party-label {
  font-size: 10px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.inv-party-name {
  font-size: 13px;
  font-weight: bold;
  color: #1a1a1a;
}

.inv-party-detail {
  font-size: 11px;
  color: #555;
  line-height: 1.6;
}

.inv-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;
}

.inv-table thead tr {
  background: #1a56db;
  color: #fff;
}

.inv-table th {
  padding: 8px 10px;
  font-size: 11px;
  font-weight: bold;
  text-align: left;
}

.inv-table td {
  padding: 8px 10px;
  font-size: 11px;
  border-bottom: 0.5px solid #e5e7eb;
}

.inv-table tbody tr:nth-child(even) td {
  background: #f4f7ff;
}

.subtotal-row td, .tax-row td {
  background: #f0f4ff;
  font-size: 11px;
  border-top: 0.5px solid #e5e7eb;
}

.total-row td {
  background: #e8effe;
  font-weight: bold;
  font-size: 13px;
  border-top: 2px solid #1a56db;
  color: #1a56db;
}

.inv-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-top: 16px;
  border-top: 0.5px solid #e5e7eb;
  gap: 24px;
}

.inv-bank-label {
  font-size: 10px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.inv-bank {
  font-size: 11px;
  color: #333;
  line-height: 1.7;
}

.inv-notes {
  font-size: 10px;
  color: #888;
  font-style: italic;
  text-align: right;
  max-width: 260px;
  line-height: 1.6;
}

/* ===== CSS untuk print / @page (Pagedjs / browser print) ===== */
@media print {
  @page {
    size: A4;
    margin: 18mm 18mm;
  }

  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .invoice {
    padding: 0;
  }
}
</style>
