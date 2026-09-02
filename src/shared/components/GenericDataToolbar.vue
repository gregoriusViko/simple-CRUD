<!-- components/GenericDataToolbar.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { refDebounced } from '@vueuse/core'

// 1. defineModel menggantikan props.modelValue dan emit('update:modelValue')
const model = defineModel<string>({ default: '' })

const props = defineProps<{
  title: string
  subtitle?: string
  searchPlaceholder?: string
  debounceTime?: number
}>()

// 1. Teks yang langsung berubah saat diketik (untuk UI)
const localSearch = ref(model.value)

// 2. VueUse akan otomatis membuatkan versi "delay"-nya (misal 400ms)
const debouncedSearch = refDebounced(localSearch, props.debounceTime || 400)

// 3. Saat nilai delay-nya berubah, baru kirim ke parent (model)
watch(debouncedSearch, (newVal) => {
  model.value = newVal
})

// Sinkronisasi jika parent mereset filter
watch(model, (newVal) => {
  if (newVal !== localSearch.value) localSearch.value = newVal
})
</script>

<template>
  <div class="border-b border-slate-100 p-4 sm:p-5">
    <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

      <div>
        <h2 class="font-bold text-slate-900">{{ title }}</h2>
        <p v-if="subtitle" class="mt-0.5 text-sm text-slate-500">
          {{ subtitle }}
        </p>
      </div>

      <div class="flex flex-col gap-2 sm:flex-row sm:items-center lg:justify-end">
        <IconField class="w-full sm:w-60">
          <InputIcon class="pi pi-search" />
          <InputText v-model="localSearch" class="w-full" :placeholder="searchPlaceholder || 'Cari...'" />
        </IconField>

        <slot name="filters"></slot>
      </div>

    </div>
  </div>
</template>
