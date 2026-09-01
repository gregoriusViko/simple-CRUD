<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40 sm:p-5">
    <span v-if="icon" :class="`grid size-9 place-items-center rounded-xl bg-${theme}-50 text-${theme}-600`">
      <i :class="icon" />
    </span>
    <Skeleton v-if="loading" width="4rem" height="1.75rem" class="mt-4" />
    <p v-else class="mt-4 text-2xl font-bold text-slate-950">{{ value }}</p>
    <p class="mt-1 text-xs font-medium text-slate-500 sm:text-sm">{{ title }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
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
</script>
