<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import type { TagProps } from 'primevue/tag'
import EmployeeDetailsDrawer from '../components/EmployeeDetailsDrawer.vue'
import EmployeeFormDialog from '../components/EmployeeFormDialog.vue'
import GenericCard from '@/components/GenericCard.vue'
import { useEmployeesStore } from '../stores/useEmployeesStore'
import type { Employee, EmployeeRole } from '../types/employee'
import { employeeCode, employeeFullName, employeeInitials, roleLabels } from '../utils/employee'

const store = useEmployeesStore()
const { employees, total, loading, deletingId, error } = storeToRefs(store)
const confirm = useConfirm()
const toast = useToast()

const search = ref('')
const selectedDepartment = ref<string | null>(null)
const selectedRole = ref<EmployeeRole | null>(null)
const formVisible = ref(false)
const detailsVisible = ref(false)
const selectedEmployee = ref<Employee | null>(null)
const editingEmployee = ref<Employee | null>(null)
const mobileFirst = ref(0)
const mobileRows = 10

const roleOptions: { label: string; value: EmployeeRole }[] = [
  { label: 'Admin', value: 'admin' },
  { label: 'Moderator', value: 'moderator' },
  { label: 'Karyawan', value: 'user' },
]

const departments = computed(() =>
  [...new Set(employees.value.map((employee) => employee.department))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b)),
)

const employeeColumns = [
  { field: 'employee', header: 'Karyawan', sortable: true, style: 'min-width: 260px' },
  { field: 'title', header: 'Jabatan', sortable: true, style: 'min-width: 190px' },
  { field: 'department', header: 'Departemen', sortable: true, style: 'min-width: 150px' },
  { field: 'city', header: 'Lokasi', sortable: true, style: 'min-width: 130px' },
  { field: 'role', header: 'Akses', sortable: true, style: 'width: 125px' },
];

const filteredEmployees = computed(() => {
  const keyword = search.value.trim().toLocaleLowerCase('id')

  return employees.value.filter((employee) => {
    const matchesSearch =
      !keyword ||
      [
        employeeFullName(employee),
        employee.email,
        employee.title,
        employee.department,
        employee.company,
        employee.city,
        employeeCode(employee.id),
      ].some((value) => value.toLocaleLowerCase('id').includes(keyword))
    const matchesDepartment =
      !selectedDepartment.value || employee.department === selectedDepartment.value
    const matchesRole = !selectedRole.value || employee.role === selectedRole.value

    return matchesSearch && matchesDepartment && matchesRole
  })
})

const mobileEmployees = computed(() =>
  filteredEmployees.value.slice(mobileFirst.value, mobileFirst.value + mobileRows),
)

const locationCount = computed(
  () => new Set(employees.value.map((employee) => `${employee.city}-${employee.country}`)).size,
)

const adminCount = computed(
  () => employees.value.filter((employee) => employee.role === 'admin').length,
)

const hasFilters = computed(
  () => Boolean(search.value || selectedDepartment.value || selectedRole.value),
)

onMounted(() => store.loadEmployees())

watch([search, selectedDepartment, selectedRole], () => {
  mobileFirst.value = 0
})

function roleSeverity(role: Employee['role']): TagProps['severity'] {
  if (role === 'admin') return 'danger'
  if (role === 'moderator') return 'warn'
  return 'secondary'
}

function openCreate() {
  editingEmployee.value = null
  formVisible.value = true
}

function openEdit(employee: Employee) {
  detailsVisible.value = false
  editingEmployee.value = employee
  formVisible.value = true
}

function openDetails(employee: Employee) {
  selectedEmployee.value = employee
  detailsVisible.value = true
}

function clearFilters() {
  search.value = ''
  selectedDepartment.value = null
  selectedRole.value = null
}

function confirmDelete(employee: Employee) {
  confirm.require({
    header: 'Hapus karyawan?',
    message: `${employeeFullName(employee)} akan dihapus dari daftar pada sesi ini.`,
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Batal',
    rejectProps: { severity: 'secondary', outlined: true },
    acceptLabel: 'Ya, hapus',
    acceptProps: { severity: 'danger' },
    accept: async () => {
      try {
        await store.deleteEmployee(employee.id)
        if (selectedEmployee.value?.id === employee.id) detailsVisible.value = false
        toast.add({
          severity: 'success',
          summary: 'Karyawan dihapus',
          detail: `${employeeFullName(employee)} telah dihapus dari daftar.`,
          life: 3000,
        })
      } catch (deleteError) {
        toast.add({
          severity: 'error',
          summary: 'Gagal menghapus',
          detail:
            deleteError instanceof Error ? deleteError.message : 'Silakan coba beberapa saat lagi.',
          life: 4000,
        })
      }
    },
  })
}

function handleSaved(employee: Employee) {
  if (selectedEmployee.value?.id === employee.id) selectedEmployee.value = employee
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
    <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40 sm:p-5">
      <span class="grid size-9 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
        <i class="pi pi-users text-sm" />
      </span>
      <Skeleton v-if="loading" width="4rem" height="1.75rem" class="mt-4" />
      <p v-else class="mt-4 text-2xl font-bold text-slate-950">{{ total }}</p>
      <p class="mt-1 text-xs font-medium text-slate-500 sm:text-sm">Total karyawan</p>
    </div>
    <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40 sm:p-5">
      <span class="grid size-9 place-items-center rounded-xl bg-cyan-50 text-cyan-600">
        <i class="pi pi-sitemap text-sm" />
      </span>
      <Skeleton v-if="loading" width="4rem" height="1.75rem" class="mt-4" />
      <p v-else class="mt-4 text-2xl font-bold text-slate-950">{{ departments.length }}</p>
      <p class="mt-1 text-xs font-medium text-slate-500 sm:text-sm">Departemen</p>
    </div>
    <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40 sm:p-5">
      <span class="grid size-9 place-items-center rounded-xl bg-amber-50 text-amber-600">
        <i class="pi pi-map-marker text-sm" />
      </span>
      <Skeleton v-if="loading" width="4rem" height="1.75rem" class="mt-4" />
      <p v-else class="mt-4 text-2xl font-bold text-slate-950">{{ locationCount }}</p>
      <p class="mt-1 text-xs font-medium text-slate-500 sm:text-sm">Lokasi kerja</p>
    </div>
    <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40 sm:p-5">
      <span class="grid size-9 place-items-center rounded-xl bg-rose-50 text-rose-600">
        <i class="pi pi-shield text-sm" />
      </span>
      <Skeleton v-if="loading" width="4rem" height="1.75rem" class="mt-4" />
      <p v-else class="mt-4 text-2xl font-bold text-slate-950">{{ adminCount }}</p>
      <p class="mt-1 text-xs font-medium text-slate-500 sm:text-sm">Administrator</p>
    </div>
  </section>

  <section class="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40">
    <div class="border-b border-slate-100 p-4 sm:p-5">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 class="font-bold text-slate-900">Semua karyawan</h2>
          <p class="mt-0.5 text-sm text-slate-500">
            {{ filteredEmployees.length }} dari {{ total }} profil ditampilkan
          </p>
        </div>
        <div class="grid gap-2 sm:grid-cols-3 lg:w-[680px]">
          <IconField>
            <InputIcon class="pi pi-search" />
            <InputText v-model="search" class="w-full" placeholder="Cari nama, email, ID…" />
          </IconField>
          <Select v-model="selectedDepartment" :options="departments" placeholder="Semua departemen" show-clear
            class="w-full" />
          <Select v-model="selectedRole" :options="roleOptions" option-label="label" option-value="value"
            placeholder="Semua akses" show-clear class="w-full" />
        </div>
      </div>
    </div>

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
