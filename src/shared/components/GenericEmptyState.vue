<!-- GenericEmptyState.vue -->
<template>
  <div class="px-6 py-14 text-center">
    <span :class="['mx-auto grid size-12 place-items-center rounded-full', iconBgClass, iconColorClass]">
      <i :class="['pi', icon]" />
    </span>
    <h3 class="mt-4 font-bold text-slate-900">{{ title }}</h3>
    <p class="mt-2 text-sm text-slate-500">{{ description }}</p>
    <slot name="action"></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  icon: string
  iconBgClass?: string
  iconColorClass?: string
}>()
</script>
