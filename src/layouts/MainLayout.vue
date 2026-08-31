<script setup lang="ts">
import MainSidebar from '@/components/MainSidebar.vue'
</script>


<template>
  <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-3">
          <MainSidebar />
          <span class="grid size-9 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
            <i class="pi pi-users text-sm" />
          </span>
          <div>
            <p class="text-base font-bold leading-tight text-slate-900">NusaPeople</p>
            <p class="text-[11px] font-medium text-slate-400">People operations</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span
            class="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:flex">
            <span class="size-1.5 rounded-full bg-emerald-500" />
            DummyJSON terhubung
          </span>
          <Avatar label="HR" shape="circle" class="bg-slate-900 text-xs font-bold text-white" />
        </div>
      </div>
    </header>

    <div class="min-h-screen bg-slate-50 text-slate-900">
      <main class="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        <RouterView />
      </main>
    </div>
</template>
