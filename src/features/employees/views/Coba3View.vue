<template>
  <div class="app-container">
    <div class="controls">
      <button @click="renderPdfPreview">1. Tampilkan Preview Kertas</button>
      <button v-if="isReady" @click="printPdf">2. Save as PDF (Print)</button>
    </div>

    <hr />

    <!-- WADAH PREVIEW: Di sinilah Paged.js akan menggambar halaman A4-nya -->
    <div id="pdf-preview-container"></div>

    <!-- SUMBER KONTEN: Kita sembunyikan dengan display:none -->
    <!-- Konten di sini tetap bisa menggunakan reaktivitas data Vue (seperti {{ nama }}) -->
    <div id="source-html" style="display: none;">
      <div class="print-document">

        <!-- Halaman 1 -->
        <h1>Laporan Keuangan Sederhana</h1>
        <p>Laporan ini dibuat oleh: <strong>{{ namaPembuat }}</strong>.</p>
        <p>Ini adalah contoh teks pada halaman pertama. Di bawah ini terdapat elemen pemecah halaman (page break) sehingga teks berikutnya akan otomatis berada di halaman kedua.</p>

        <div class="page-break"></div> <!-- Memaksa pindah halaman -->

        <!-- Halaman 2 -->
        <h2>Detail Laporan - Halaman 2</h2>
        <p>Ini adalah teks di halaman kedua. Paged.js otomatis menyusun margin yang sudah kita tentukan di dalam file print.css.</p>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Previewer } from 'pagedjs'

const namaPembuat = ref('Budi Santoso') // Contoh data Vue (reaktif)
const isReady = ref(false)

const renderPdfPreview = async () => {
  // 1. Ambil elemen sumber HTML yang disembunyikan
  const sourceElement = document.getElementById('source-html').innerHTML

  // 2. Ambil wadah untuk menampilkan hasil Paged.js
  const targetContainer = document.getElementById('pdf-preview-container')

  // Bersihkan wadah jika pengguna klik tombol berkali-kali
  targetContainer.innerHTML = ''

  // 3. Inisialisasi Paged.js
  const paged = new Previewer()

  try {
    // 4. Render HTML ke dalam wadah, sambil memuat file CSS kita
    // Argumen: (HTML, [Array path file CSS], Elemen Tujuan)
    await paged.preview(sourceElement, ['/print.css'], targetContainer)
    isReady.value = true
  } catch (error) {
    console.error("Gagal merender Paged.js", error)
  }
}

const printPdf = () => {
  // Membuka dialog print bawaan browser
  window.print()
}
</script>

<style scoped>
/* CSS ini hanya untuk tampilan tombol di web, tidak masuk ke PDF */
.controls {
  margin-bottom: 20px;
}
button {
  margin-right: 10px;
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #33a06f;
}

/* Menyembunyikan elemen web lain (seperti tombol) saat dialog print terbuka */
@media print {
  .controls, hr {
    display: none !important;
  }
}
</style>
