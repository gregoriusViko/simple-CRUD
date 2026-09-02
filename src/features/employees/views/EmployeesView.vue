<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import type { TagProps } from 'primevue/tag'

import EmployeeDetailsDrawer from '../components/EmployeeDetailsDrawer.vue'
import EmployeeFormDialog from '../components/EmployeeFormDialog.vue'

import { useEmployeesStore } from '../stores/useEmployeesStore'
import type { Employee, EmployeeRole } from '../types/employee'
import { employeeCode, employeeFullName, employeeInitials, roleLabels } from '../utils/employee'

// Import Composables
import { useEmployeeFilters } from '../composables/useEmployeeFilters'
import { useEmployeeStats } from '../composables/useEmployeeStats'
import { useEmployeeActions } from '../composables/useEmployeeActions'

// Store & Init
const store = useEmployeesStore()
const { employees, total, loading, deletingId, error } = storeToRefs(store)
onMounted(() => store.loadEmployees())

// Gunakan Composables
const { search, selectedDepartment, selectedRole, departments, filteredEmployees, hasFilters, clearFilters } = useEmployeeFilters(employees)
const { locationCount, adminCount } = useEmployeeStats(employees)
const { formVisible, detailsVisible, selectedEmployee, editingEmployee, openCreate, openEdit, openDetails, handleSaved, confirmDelete } = useEmployeeActions()

// State lokal yang bersifat UI-specific
const mobileFirst = ref(0)
const mobileRows = 10

const mobileEmployees = computed(() =>
  filteredEmployees.value.slice(mobileFirst.value, mobileFirst.value + mobileRows),
)

// Reset paginasi jika filter berubah
watch([search, selectedDepartment, selectedRole], () => {
  mobileFirst.value = 0
})

const roleOptions: { label: string; value: EmployeeRole }[] = [
  { label: 'Admin', value: 'admin' },
  { label: 'Moderator', value: 'moderator' },
  { label: 'Karyawan', value: 'user' },
]

const employeeColumns = [
  { field: 'employee', header: 'Karyawan', sortable: true, style: 'min-width: 260px' },
  { field: 'title', header: 'Jabatan', sortable: true, style: 'min-width: 190px' },
  { field: 'department', header: 'Departemen', sortable: true, style: 'min-width: 150px' },
  { field: 'city', header: 'Lokasi', sortable: true, style: 'min-width: 130px' },
  { field: 'role', header: 'Akses', sortable: true, style: 'width: 125px' },
];

function roleSeverity(role: Employee['role']): TagProps['severity'] {
  if (role === 'admin') return 'danger'
  if (role === 'moderator') return 'warn'
  return 'secondary'
}
</script>

<template>
  <section class="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
    <div>
      <p class="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
        Direktori tim
      </p>
      <h1 class="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
        Kelola data karyawan
      </h1>
      <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
        Temukan profil tim, perbarui informasi pekerjaan, dan kelola akses dari satu tempat.
      </p>
    </div>
    <Button label="Tambah karyawan" icon="pi pi-plus" class="w-full sm:w-auto" @click="openCreate" />
  </section>

  <section class="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Ringkasan karyawan">
    <StatCard title="Total karyawan" :value="total" icon="pi pi-users" theme="indigo" :loading="loading" />
    <StatCard title="Departemen" :value="departments.length" icon="pi pi-sitemap" theme="cyan" :loading="loading" />
    <StatCard title="Lokasi kerja" :value="locationCount" icon="pi pi-map-marker" theme="amber" :loading="loading" />
    <StatCard title="Administrator" :value="adminCount" icon="pi pi-shield" theme="rose" :loading="loading" />
  </section>

  <section class="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40">
    <GenericDataToolbar title="Semua karyawan"
      :subtitle="`${filteredEmployees.length} dari ${total} profil ditampilkan`" v-model="search"
      searchPlaceholder="Cari nama, email, ID…">
      <template #filters>
        <!-- Hanya sisakan Select untuk masuk ke slot filter -->
        <Select v-model="selectedDepartment" :options="departments" placeholder="Semua departemen" show-clear
          class="w-full sm:w-48" />
        <Select v-model="selectedRole" :options="roleOptions" option-label="label" option-value="value"
          placeholder="Semua akses" show-clear class="w-full sm:w-48" />
      </template>
    </GenericDataToolbar>

    <div v-if="error" class="p-6 sm:p-10">
      <div class="mx-auto max-w-md text-center">
        <span class="mx-auto grid size-12 place-items-center rounded-full bg-red-50 text-red-600">
          <i class="pi pi-cloud-off" />
        </span>
        <h3 class="mt-4 font-bold text-slate-900">Data belum dapat dimuat</h3>
        <p class="mt-2 text-sm leading-6 text-slate-500">{{ error }}</p>
        <Button label="Coba lagi" icon="pi pi-refresh" class="mt-4" outlined @click="store.loadEmployees(true)" />
      </div>
    </div>

    <div v-else-if="loading" class="space-y-3 p-4 sm:p-5">
      <div v-for="row in 6" :key="row" class="flex items-center gap-4 py-2">
        <Skeleton shape="circle" size="2.5rem" />
        <div class="flex-1 space-y-2">
          <Skeleton width="35%" height="0.8rem" />
          <Skeleton width="22%" height="0.65rem" />
        </div>
        <Skeleton width="7rem" height="1.5rem" class="hidden sm:block" />
      </div>
    </div>

    <template v-else>
      <div v-if="filteredEmployees.length" class="hidden md:block">
        <GenericTable :data="filteredEmployees" :columns="employeeColumns" showActions :deletingId="deletingId"
          @view="openDetails" @edit="openEdit" @delete="confirmDelete">
          <!-- Custom render untuk kolom 'employee' -->
          <template #cell-employee="{ data }">
            <button class="flex items-center gap-3 text-left" @click="openDetails(data)">
              <Avatar v-if="data.image" :image="data.image" shape="circle" class="size-10 bg-slate-100" />
              <Avatar v-else :label="employeeInitials(data)" shape="circle"
                class="size-10 bg-indigo-100 text-xs font-bold text-indigo-700" />
              <span class="min-w-0">
                <span class="block font-semibold text-slate-900 hover:text-indigo-600">
                  {{ employeeFullName(data) }}
                </span>
                <span class="block text-xs text-slate-400">{{ employeeCode(data.id) }}</span>
              </span>
            </button>
          </template>

          <!-- Custom render untuk kolom 'title' (Karena ada email di bawahnya) -->
          <template #cell-title="{ data }">
            <div>
              <p class="font-medium text-slate-700">{{ data.title }}</p>
              <p class="mt-0.5 text-xs text-slate-400">{{ data.email }}</p>
            </div>
          </template>

          <!-- Custom render untuk kolom 'city' (Karena ada icon map) -->
          <template #cell-city="{ data }">
            <span class="flex items-center gap-2 text-slate-500">
              <i class="pi pi-map-marker text-xs text-slate-300" />
              {{ data.city }}
            </span>
          </template>

          <!-- Custom render untuk kolom 'role' (Karena menggunakan PrimeVue Tag) -->
          <template #cell-role="{ data }: { data: Employee }">
            <Tag :value="roleLabels[data.role]" :severity="roleSeverity(data.role)" rounded />
          </template>
        </GenericTable>
      </div>

      <div v-if="filteredEmployees.length" class="space-y-3 bg-slate-50/60 p-3 md:hidden">
        <GenericCard v-for="employee in mobileEmployees" :key="employee.id" :id="employee.id"
          :title="employeeFullName(employee)" :subtitle="employee.title" :image="employee.image"
          :initials="employeeInitials(employee)" :badge-text="roleLabels[employee.role]"
          :badge-severity="roleSeverity(employee.role)" :code="employeeCode(employee.id)" :metadata="[
            { label: 'Departemen', value: employee.department },
            { label: 'Lokasi', value: employee.city }
          ]" :deleting="deletingId === employee.id" @view="openDetails(employee)" @edit="openEdit(employee)"
          @remove="confirmDelete(employee)" />
        <Paginator v-if="filteredEmployees.length > mobileRows" v-model:first="mobileFirst" :rows="mobileRows"
          :total-records="filteredEmployees.length" template="PrevPageLink CurrentPageReport NextPageLink"
          current-page-report-template="{first}–{last} dari {totalRecords}"
          class="rounded-xl border border-slate-200" />
      </div>

      <div v-else class="px-6 py-14 text-center">
        <span class="mx-auto grid size-12 place-items-center rounded-full bg-slate-100 text-slate-400">
          <i class="pi pi-search" />
        </span>
        <h3 class="mt-4 font-bold text-slate-900">Karyawan tidak ditemukan</h3>
        <p class="mt-2 text-sm text-slate-500">Coba ubah kata kunci atau filter pencarian.</p>
        <Button v-if="hasFilters" label="Hapus semua filter" class="mt-4" text @click="clearFilters" />
      </div>
    </template>
  </section>

  <p class="mt-5 text-center text-xs leading-5 text-slate-400">
    Data berasal dari DummyJSON. Penambahan, perubahan, dan penghapusan disimpan selama sesi ini.
  </p>

  <!-- ini harusnya diluar main, tapi katanya gak papa -->
  <EmployeeFormDialog v-model:visible="formVisible" :employee="editingEmployee" @saved="handleSaved" />
  <EmployeeDetailsDrawer v-model:visible="detailsVisible" :employee="selectedEmployee" @edit="openEdit" />
</template>
