<script setup lang="ts">
import { onMounted, onUnmounted, nextTick } from 'vue'
import bookCSS from '@/assets/print.css?raw'

let pagedInstance: any = null

onMounted(async () => {
  await nextTick() // Tunggu Vue selesai render DOM

  // Import Previewer (bukan polyfill)
  const { Previewer } = await import('pagedjs')

  const content = document.querySelector('#book-content') as HTMLElement
  const target = document.querySelector('#paged-output') as HTMLElement

  if (!content || !target) return

  pagedInstance = new Previewer()

  // Buat Blob URL dari string CSS
  const blob = new Blob([bookCSS], { type: 'text/css' })
  const cssUrl = URL.createObjectURL(blob)

  try {
    await pagedInstance.preview(
      content.innerHTML,  // konten HTML mentah
      [cssUrl],                 // stylesheets tambahan (kosong = pakai CSS di halaman)
      target              // container output
    )
  } catch (e) {
    console.error('Paged.js error:', e)
  }
})

onUnmounted(() => {
  // Bersihkan DOM yang dihasilkan Paged.js
  const target = document.querySelector('#paged-output')
  if (target) target.innerHTML = ''
})
</script>

<template>
  <div id="book-content" style="display: none;">
    <!-- ================= HALAMAN SAMPUL (COVER) ================= -->
    <div class="cover-page">
      <h1 style="margin:0; font-size: 28pt; break-before: auto;">JUDUL BUKU UTAMA</h1>
      <p style="text-indent:0; font-style: italic; margin-top: 10px; font-size: 12pt;">Sub-judul atau Penjelasan Singkat
        Buku Ini</p>
      <div style="margin-top: 60mm; font-family: sans-serif; font-size: 11pt;">
        <strong>Nama Penulis</strong>
      </div>
    </div>

    <!-- ================= HALAMAN KONTEN / BAB 1 ================= -->
    <div>
      <h1>Pendahuluan</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat.</p>
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        Excepteur
        sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      <p>Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est
        eros
        bibendum elit, nec luctus magna felis sollicitudin mauris.</p>
    </div>

    <!-- ================= HALAMAN KONTEN / BAB 2 ================= -->
    <div>
      <h1>Bab 1: Memulai Perjalanan</h1>
      <p>In hac habitasse platea dictumst. Integer tempus convallis augue. Etiam facilisis. Nunc elementum fermentum
        wic.
        Aenean placerat. Ut imperdiet, enim sed gravida sollicitudin, felis odio placerat quam, ac pulvinar elit purus
        eget enim.</p>
      <p>Nunc tincidunt ante vitae massa. Duis ante orci, molestie vitae vehicula venenatis, tincidunt ac pede. Integer
        tempor ante ac urna accumsan consequat.</p>

      <h2>Sub-Bab Penting</h2>
      <p>Aliquam erat volutpat. Sed congue augue vitae neque. Nulla consectetuer porttitor pede. Fusce purus morbi
        tortor
        magna convallis auctor tempor.</p>
      <p>Vivamus a ante vel magna sollicitudin aliquam. Curabitur consectetuer justo vel pede. Ut euismod orci sit amet
        elit. Vestibulum quis felis vel magna commodo vulputate.</p>
    </div>
  </div>

  <div id="paged-output"></div>
</template>
