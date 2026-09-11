<script setup lang="ts">
import { useExportExcel } from '@/shared/composables/useExportExcel';
import type { Column } from 'exceljs';
import { ref, computed } from 'vue';
import { useMediaQuery } from '@vueuse/core'

// Deteksi layar dengan lebar maksimal 640px (ukuran standar sm pada Tailwind)
const isMobile = useMediaQuery('(max-width: 640px)')

const { exportToExcel, isExporting } = useExportExcel();
const visible = ref(false);

const props = withDefaults(defineProps<{
  data: Record<string, unknown>[];
  columns?: Partial<Column>[];
  fileName?: string;
  buttonClass?: string;
}>(), {
  // Langsung berikan nilai default di sini, TypeScript akan otomatis mengerti
  // bahwa props.fileName sekarang PASTI string, bukan undefined lagi.
  fileName: 'export',
  buttonClass: 'w-full sm:w-auto',
  // Untuk property array/object, Vue melempar props saat ini sebagai argumen pertama
  columns: (currentProps) => {
    // Kita bisa langsung memproses data di dalam sini
    const allKeys = Array.from(new Set(currentProps.data.flatMap((item) => Object.keys(item))));
    return allKeys.map((key) => ({ key, header: key }));
  }
});

const selectedColumns = ref<Partial<Column>[]>([...props.columns]);

const usingColumns = computed(() =>
  props.columns.filter((column) =>
    selectedColumns.value.some((selected) => selected.key === column.key)
  )
)

</script>

<template>
  <Button @click="visible = true" severity="success" icon="pi pi-file-excel" label="Ekspor Excel" :class="props.buttonClass" />

  <Dialog v-model:visible="visible" modal :style="{ width: '50vw', maxWidth: '900px' }"
    :breakpoints="{ '1024px': '70vw', '768px': '85vw', '640px': '95vw' }" class="p-fluid">
    <!-- Header Dialog -->
    <template #header>
      <div class="flex items-center gap-3">
        <div class="bg-green-100 p-2 rounded-lg flex items-center justify-center">
          <i class="pi pi-file-excel text-green-700 text-xl"></i>
        </div>
        <h3 class="text-xl font-bold text-slate-800">Konfigurasi Ekspor</h3>
      </div>
    </template>

    <div class="flex flex-col gap-6 py-2">
      <!-- Section 1: Pemilihan Kolom -->
      <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <h4 class="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <i class="pi pi-check-square text-slate-500"></i> Pilih Kolom Data
        </h4>

        <!-- MENGGUNAKAN FLEX WRAP: Akan mengisi ke samping mengikuti panjang teks, otomatis turun jika mentok -->
        <div class="flex flex-wrap gap-y-3 gap-x-6 max-h-48 overflow-y-auto pr-2">
          <div v-for="column of columns" :key="column.key" class="flex items-center gap-2">
            <Checkbox v-model="selectedColumns" :inputId="String(column.key)" name="columns" :value="column" />
            <label :for="String(column.key)"
              class="text-sm text-slate-700 cursor-pointer select-none whitespace-nowrap">
              {{ Array.isArray(column.header) ? column.header.join(' / ') : column.header }}
            </label>
          </div>
        </div>
      </div>

      <!-- Section 2: Preview Tabel -->
      <div class="flex flex-col gap-2">
        <h4 class="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <i class="pi pi-table text-slate-500"></i> Preview Tabel
        </h4>

        <div v-if="selectedColumns.length" class="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <DataTable :value="data" :paginator="true" :rows="5" responsiveLayout="scroll" size="small"
            :pageLinkSize="isMobile ? 3 : 5" class="w-full text-sm"
            >
            <Column v-for="column of usingColumns" :key="column.key" :field="String(column.key)"
              :header="Array.isArray(column.header) ? column.header.join(' / ') : (column.header as string)"
              class="whitespace-nowrap" />
          </DataTable>
        </div>

        <div v-else
          class="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 text-slate-500 gap-3 transition-all">
          <i class="pi pi-th-large text-3xl text-slate-400"></i>
          <p class="text-sm font-medium text-center">
            Belum ada kolom terpilih.<br />
            <span class="font-normal text-slate-400">Centang minimal satu kolom di atas untuk melihat preview.</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Footer Action Buttons -->
    <template #footer>
      <div class="flex flex-row justify-end gap-3 pt-4 border-t border-slate-100">
        <Button label="Batal" icon="pi pi-times" severity="secondary" text @click="visible = false" class="w-auto" />
        <Button label="Unduh Excel" icon="pi pi-download" severity="success" :loading="isExporting"
          :disabled="!selectedColumns.length" @click="exportToExcel(data, fileName, usingColumns)"
          class="w-auto whitespace-nowrap" />
      </div>
    </template>
  </Dialog>
</template>
