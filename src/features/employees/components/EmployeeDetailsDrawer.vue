<script setup lang="ts">
import { computed } from 'vue'
import type { TagProps } from 'primevue/tag'
import type { Employee } from '../types/employee'
import { employeeCode, employeeFullName, employeeInitials, roleLabels } from '../utils/employee'

// 1. Definisikan v-model:visible menggunakan defineModel
const visible = defineModel<boolean>('visible', { default: false })

// 2. Hapus 'visible' dari defineProps
const props = defineProps<{
  employee: Employee | null
}>()

// 3. Hapus 'update:visible' dari defineEmits
const emit = defineEmits<{
  edit: [employee: Employee]
}>()

const roleSeverity = computed<TagProps['severity']>(() => {
  if (props.employee?.role === 'admin') return 'danger'
  if (props.employee?.role === 'moderator') return 'warn'
  return 'secondary'
})
</script>

<template>
  <Drawer blockScroll v-model:visible="visible" position="right" :style="{ width: 'min(92vw, 420px)' }">
    <template #header>
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Profil karyawan</p>
        <h2 class="mt-1 text-lg font-bold text-slate-900">Detail informasi</h2>
      </div>
    </template>

    <div v-if="employee" class="flex h-full flex-col">
      <div class="flex-1 overflow-y-auto pr-2 pb-4">
        <div class="rounded-2xl bg-slate-50 p-5 text-center">
          <Avatar v-if="employee.image" :image="employee.image" shape="circle"
            class="mb-3 size-20 border-4 border-white shadow-sm" />
          <Avatar v-else :label="employeeInitials(employee)" shape="circle"
            class="mb-3 size-20 bg-indigo-100 text-xl font-bold text-indigo-700" />
          <h3 class="text-xl font-bold text-slate-900">{{ employeeFullName(employee) }}</h3>
          <p class="mt-1 text-sm text-slate-500">{{ employee.title }}</p>
          <div class="mt-3 flex justify-center gap-2">
            <Tag :value="roleLabels[employee.role]" :severity="roleSeverity" rounded />
            <span class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
              {{ employeeCode(employee.id) }}
            </span>
          </div>
        </div>

        <div class="mt-7 space-y-6">
          <section>
            <h4 class="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Kontak</h4>
            <dl class="mt-3 space-y-4">
              <div class="flex gap-3">
                <span class="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500">
                  <i class="pi pi-envelope text-sm" />
                </span>
                <div class="min-w-0">
                  <dt class="text-xs text-slate-400">Email</dt>
                  <dd class="truncate text-sm font-medium text-slate-700">{{ employee.email }}</dd>
                </div>
              </div>
              <div class="flex gap-3">
                <span class="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500">
                  <i class="pi pi-phone text-sm" />
                </span>
                <div>
                  <dt class="text-xs text-slate-400">Telepon</dt>
                  <dd class="text-sm font-medium text-slate-700">{{ employee.phone }}</dd>
                </div>
              </div>
              <div class="flex gap-3">
                <span class="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500">
                  <i class="pi pi-map-marker text-sm" />
                </span>
                <div>
                  <dt class="text-xs text-slate-400">Lokasi</dt>
                  <dd class="text-sm font-medium text-slate-700">
                    {{ employee.city }}, {{ employee.country }}
                  </dd>
                </div>
              </div>
            </dl>
          </section>

          <section>
            <h4 class="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Pekerjaan</h4>
            <dl class="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-100 px-4">
              <div class="flex items-center justify-between gap-4 py-3">
                <dt class="text-sm text-slate-500">Departemen</dt>
                <dd class="text-right text-sm font-semibold text-slate-800">
                  {{ employee.department }}
                </dd>
              </div>
              <div class="flex items-center justify-between gap-4 py-3">
                <dt class="text-sm text-slate-500">Perusahaan</dt>
                <dd class="text-right text-sm font-semibold text-slate-800">
                  {{ employee.company }}
                </dd>
              </div>
              <div class="flex items-center justify-between gap-4 py-3">
                <dt class="text-sm text-slate-500">Usia</dt>
                <dd class="text-sm font-semibold text-slate-800">{{ employee.age }} tahun</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>

      <div class="mt-auto border-t border-slate-100 pt-4 bg-white">
        <Button label="Edit data karyawan" icon="pi pi-pencil" class="w-full" outlined
        @click="emit('edit', employee)" />
      </div>
    </div>
  </Drawer>
</template>
