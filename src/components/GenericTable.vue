<script setup lang="ts">
// GenericTable.vue

// Definisikan tipe untuk kolom
export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  style?: string;
}

const props = withDefaults(defineProps<{
  data: [];
  columns: TableColumn[];
  dataKey?: string;
  showActions?: boolean;
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
</script>

<template>
  <DataTable
    :value="data"
    :data-key="dataKey"
    paginator
    :rows="10"
    :rows-per-page-options="[10, 20, 50]"
    striped-rows
    row-hover
    paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
    current-page-report-template="{first}–{last} dari {totalRecords}"
    class="generic-table"
  >
    <!-- Looping Kolom Secara Dinamis -->
    <Column
      v-for="col in columns"
      :key="col.field"
      :field="col.field"
      :header="col.header"
      :sortable="col.sortable"
      :style="col.style"
    >
      <template #body="{ data }">
        <!--
          DYNAMIC SLOT: Ini adalah keajaibannya.
          Jika Parent tidak mengirimkan template khusus untuk kolom ini, tampilkan teks biasa.
          Jika mengirim, gunakan template dari Parent.
        -->
        <slot :name="`cell-${col.field}`" :data="data">
          {{ data[col.field] }}
        </slot>
      </template>
    </Column>

    <!-- Kolom Aksi (Opsional) -->
    <Column v-if="showActions" :header="actionHeader" :style="actionStyle">
      <template #body="{ data }">
        <!-- Slot khusus aksi, jika parent ingin membuat tombol custom -->
        <slot name="actions" :data="data">
          <div class="flex justify-end gap-1">
            <Button
              icon="pi pi-eye"
              severity="secondary"
              text rounded
              aria-label="Lihat detail"
              @click="emit('view', data)"
            />
            <Button
              icon="pi pi-pencil"
              severity="secondary"
              text rounded
              aria-label="Edit data"
              @click="emit('edit', data)"
            />
            <Button
              icon="pi pi-trash"
              severity="danger"
              text rounded
              aria-label="Hapus data"
              :loading="deletingId === data.id"
              @click="emit('delete', data)"
            />
          </div>
        </slot>
      </template>
    </Column>
  </DataTable>
</template>
