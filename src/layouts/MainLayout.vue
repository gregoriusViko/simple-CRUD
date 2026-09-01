<script setup lang="ts">
import { ref } from 'vue';

// HANYA BUTUH 1 VARIABEL SEKARANG
const isOpen = ref(false);
</script>

<template>
  <div class="flex h-screen w-full bg-surface-50 overflow-hidden relative">

    <!-- ========================================== -->
    <!-- 1. BACKDROP GELAP (Hanya untuk Mobile)       -->
    <!-- ========================================== -->
    <!-- Akan muncul jika isOpen = true, tapi otomatis hilang di Desktop (lg:hidden) -->
    <div
      v-if="isOpen"
      @click="isOpen = false"
      class="fixed inset-0 z-40 bg-slate-900/50 transition-opacity lg:hidden"
    ></div>

    <!-- ========================================== -->
    <!-- 2. SIDEBAR CERDAS (Mobile & Desktop)         -->
    <!-- ========================================== -->
    <aside
      class="fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r transition-all duration-300 ease-in-out h-full overflow-hidden shrink-0 lg:static"
      :class="[
        // PERILAKU MOBILE: Geser masuk/keluar layar
        isOpen ? 'translate-x-0' : '-translate-x-full',

        // PERILAKU DESKTOP: Tetap di tempat, tapi lebarnya yang dimainkan (72 atau 0)
        'lg:translate-x-0',
        isOpen ? 'lg:w-72' : 'lg:w-0'
      ]"
    >
      <!-- Konten Sidebar (Lebar dikunci 72 agar teks tidak terlipat saat mengecil) -->
      <div class="w-72 h-full flex flex-col">
        <SidebarContent @close="isOpen = false" />
      </div>
    </aside>

    <!-- ========================================== -->
    <!-- 3. KONTEN HALAMAN UTAMA                    -->
    <!-- ========================================== -->
    <div class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden transition-all duration-300">

      <header class="border-b border-slate-200 bg-white shrink-0">
        <div class="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">

          <div class="flex items-center gap-3">
            <!-- HANYA BUTUH 1 TOMBOL SEKARANG -->
            <Button v-if="!isOpen" @click="isOpen = !isOpen" variant="text" icon="pi pi-bars" class="p-2 text-slate-600" />

            <span class="grid size-9 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
              <i class="pi pi-users text-sm" />
            </span>
            <div>
              <p class="text-base font-bold leading-tight text-slate-900">NusaPeople</p>
              <p class="text-[11px] font-medium text-slate-400">People operations</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span class="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:flex">
              <span class="size-1.5 rounded-full bg-emerald-500" />
              DummyJSON terhubung
            </span>
            <Avatar label="HR" shape="circle" class="bg-slate-900 text-xs font-bold text-white" />
          </div>

        </div>
      </header>

      <main class="flex-1 overflow-y-auto bg-slate-50 text-slate-900">
        <div class="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
          <RouterView />
        </div>
      </main>

    </div>

  </div>
</template>
