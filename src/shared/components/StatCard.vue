<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40 sm:p-5">
    <!-- Gunakan array untuk menggabungkan class statis dan dinamis -->
    <span v-if="icon" :class="['grid size-9 place-items-center rounded-xl', themeClasses]">
      <i :class="icon" />
    </span>
    <Skeleton v-if="loading" width="4rem" height="1.75rem" class="mt-4" />
    <p v-else class="mt-4 text-2xl font-bold text-slate-950">{{ value }}</p>
    <p class="mt-1 text-xs font-medium text-slate-500 sm:text-sm">{{ title }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  value: number
  icon?: string
  loading?: boolean
  title: string
  theme?: 'indigo' | 'cyan' | 'emerald' | 'amber' | 'rose'
}>(), {
  loading: false,
  theme: 'indigo',
  icon: undefined
})

// Tuliskan nama class secara utuh agar bisa di-scan oleh Tailwind
const themeClasses = computed(() => {
  const themes = {
    indigo: 'bg-indigo-50 text-indigo-600',
    cyan: 'bg-cyan-50 text-cyan-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
  }

  return themes[props.theme]
})
</script>
