<template>
  <DataTable
    :value="data"
    v-model:expandedRows="expandedRows"
    dataKey="id"
  >
    <!-- Kolom untuk tombol panah Expand/Collapse -->
    <Column expander="true" style="width: 5rem" />

    <!-- Kolom Data Utama -->
    <Column field="nama" header="Nama Produk"></Column>
    <Column field="kategori" header="Kategori"></Column>

    <!-- Konten Baris Anakan (Row di dalam Row) -->
    <template #expansion="slotProps">
      <div class="p-3">
        <h5>Detail Pesanan untuk {{ slotProps.data.nama }}</h5>

        <DataTable :value="slotProps.data.detailPesanan">
          <Column field="id_pesanan" header="ID Pesanan"></Column>
          <Column field="pembeli" header="Nama Pembeli"></Column>
          <Column field="jumlah" header="Jumlah"></Column>
        </DataTable>
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// State untuk menyimpan ID dari baris yang sedang terbuka/expand
const expandedRows = ref({});

// Contoh data utama (Terdapat array detailPesanan di dalam setiap item)
const data = ref([
  {
    id: 'P001',
    nama: 'Laptop Asus ROG',
    kategori: 'Elektronik',
    detailPesanan: [
      { id_pesanan: 'ORD-001', pembeli: 'Budi', jumlah: 2 },
      { id_pesanan: 'ORD-002', pembeli: 'Siti', jumlah: 1 }
    ]
  },
  {
    id: 'P002',
    nama: 'Meja Kerja Minimalis',
    kategori: 'Furnitur',
    detailPesanan: [
      { id_pesanan: 'ORD-003', pembeli: 'Andi', jumlah: 5 }
    ]
  },
  {
    id: 'P003',
    nama: 'Mouse Wireless Logitech',
    kategori: 'Elektronik',
    detailPesanan: [] // Kosong jika belum ada pesanan
  }
]);
</script>
