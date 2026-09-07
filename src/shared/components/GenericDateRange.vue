<script setup lang="ts">
import { ref } from 'vue';

const date = ref<Date[]>([])
</script>

<template>
  <DatePicker ref="datePickerRef" v-model="filter" selectionMode="range" :numberOfMonths="2"
    placeholder="Pilih rentang tanggal" showIcon iconDisplay="input" class="w-full sm:w-56" :invalid="!!error"
    showButtonBar :pt="{
      root: { class: ['text-sm', error ? 'border-red-500' : 'border-slate-200'] },
      input: { class: 'py-2 px-3 shadow-none text-slate-600' },
      panel: { class: 'p-0' }
    }">
    <!-- Slot buttonbar dengan scoped variable clearCallback -->
    <template #buttonbar="">
      <div class="flex justify-end gap-2 w-full p-3 border-t border-slate-200">
        <!-- Panggil clearCallback bawaan PrimeVue saat klik Cancel -->
        <Button label="Batal" severity="secondary" text @click="handleCancel" />

        <!-- Tombol Apply -->
        <Button label="Terapkan" @click="handleSubmit" />
      </div>
    </template>
  </DatePicker>
</template>
