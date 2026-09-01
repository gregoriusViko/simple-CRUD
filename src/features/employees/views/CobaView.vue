<template>
  <div class="p-4">
    <h2>Data Pengguna</h2>

    <!-- Tombol Export dari PrimeVue -->
    <Button
      label="Export ke Excel"
      icon="pi pi-file-excel"
      severity="success"
      @click="exportToExcel"
      class="mb-4"
    />

    <!-- Tabel PrimeVue (opsional, untuk melihat data) -->
    <DataTable :value="users" tableStyle="min-width: 50rem">
      <Column field="id" header="ID"></Column>
      <Column field="name" header="Nama Lengkap"></Column>
      <Column field="email" header="Email"></Column>
      <Column field="role" header="Peran"></Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ExcelJS from 'exceljs';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

// 1. Siapkan data yang ingin diekspor
const users = ref([
  { id: 1, name: 'Budi Santoso', email: 'budi@example.com', role: 'Admin' },
  { id: 2, name: 'Siti Aminah', email: 'siti@example.com', role: 'User' },
  { id: 3, name: 'Andi Wijaya', email: 'andi@example.com', role: 'User' }
]);

// 2. Fungsi utama untuk membuat dan mengunduh Excel
const exportToExcel = async () => {
  // Buat workbook (file Excel) dan worksheet (lembar kerja) baru
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Data Users');

  // Definisikan struktur kolom Excel
  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Nama Lengkap', key: 'name', width: 30 },
    { header: 'Alamat Email', key: 'email', width: 30 },
    { header: 'Peran', key: 'role', width: 15 }
  ];

  // (Opsional) Beri style tebal/bold pada baris header
  worksheet.getRow(1).font = { bold: true };

  // Masukkan data dari state Vue ke dalam worksheet
  users.value.forEach((user) => {
    worksheet.addRow(user);
  });

  // Generate file Excel menjadi buffer memori
  const buffer = await workbook.xlsx.writeBuffer();

  // Ubah buffer menjadi Blob agar bisa diunduh oleh browser
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  // Buat link unduhan rahasia di background dan klik otomatis
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'Laporan-Pengguna.xlsx'; // Nama file yang akan diunduh
  anchor.click();

  // Bersihkan memori browser setelah selesai mengunduh
  window.URL.revokeObjectURL(url);
};
</script>
