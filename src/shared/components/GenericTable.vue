<script setup lang="ts" generic="T, U">
import { computed } from 'vue';

// GenericTable.vue

// Definisikan tipe untuk kolom
interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  style?: string;
  formatter?: (value: U) => string | number,
}

// Gunakan nama interface yang lebih jelas
interface ShowActionsConfig {
  view?: boolean;
  update?: boolean;
  delete?: boolean;
}

const props = withDefaults(defineProps<{
  data: readonly T[];
  columns: TableColumn[];
  dataKey?: string;
  showActions?: boolean | ShowActionsConfig;
  actionHeader?: string;
  actionStyle?: string;
  deletingId?: string | number | null;
}>(), {
  dataKey: 'id',
  showActions: false,
  actionHeader: 'Aksi',
  actionStyle: 'width: 120px',
  deletingId: null
});

// Emits untuk aksi default
const emit = defineEmits(['view', 'edit', 'delete']);

const actionSettings = computed(() => {
  // Jika showActions tidak dipanggil atau di-set false
  if (!props.showActions) {
    return { isVisible: false, view: false, update: false, delete: false };
  }

  // Jika dipanggil sebagai tag boolean saja (<GenericTable showActions />)
  if (props.showActions === true) {
    return { isVisible: true, view: true, update: true, delete: true };
  }

  // Jika berupa object (pengguna mengatur spesifik)
  return {
    isVisible: true,
    view: props.showActions.view ?? false,
    update: props.showActions.update ?? false,
    delete: props.showActions.delete ?? false
  };
});
</script>

<template>
  <DataTable :value="data" :data-key="dataKey" paginator :rows="10" :rows-per-page-options="[10, 20, 50]" striped-rows
    row-hover
    paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
    current-page-report-template="{first}–{last} dari {totalRecords}" class="generic-table">
    <!-- Looping Kolom Secara Dinamis -->
    <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header" :sortable="col.sortable"
      :style="col.style">
      <template #body="{ data: rowData }">
        <!--
          DYNAMIC SLOT: Ini adalah keajaibannya.
          Jika Parent tidak mengirimkan template khusus untuk kolom ini, tampilkan teks biasa.
          Jika mengirim, gunakan template dari Parent.
        -->
        <slot :name="`cell-${col.field}`" :data="rowData">
          {{ col.formatter ? col.formatter(rowData[col.field]) : rowData[col.field] }}
        </slot>
      </template>
    </Column>

    <!-- Kolom Aksi (Opsional) -->
    <Column v-if="actionSettings.isVisible" :header="actionHeader" :style="actionStyle">
      <template #body="{ data }">
        <!-- Slot khusus aksi, jika parent ingin membuat tombol custom -->
        <slot name="actions" :data="data">
          <div class="flex justify-end gap-1">
            <Button v-if="actionSettings.view" icon="pi pi-eye" severity="secondary" text rounded
              aria-label="Lihat detail" @click="emit('view', data)" />
            <Button v-if="actionSettings.update" icon="pi pi-pencil" severity="secondary" text rounded
              aria-label="Edit data" @click="emit('edit', data)" />
            <Button v-if="actionSettings.delete" icon="pi pi-trash" severity="danger" text rounded
              aria-label="Hapus data" :loading="deletingId === data.id" @click="emit('delete', data)" />
          </div>
        </slot>
      </template>
    </Column>
  </DataTable>
</template>
