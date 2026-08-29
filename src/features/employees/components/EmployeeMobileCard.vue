<script setup lang="ts">
import type { TagProps } from 'primevue/tag'
import type { Employee } from '../types/employee'
import { employeeCode, employeeFullName, employeeInitials, roleLabels } from '../utils/employee'

defineProps<{
  employee: Employee
  deleting: boolean
}>()

defineEmits<{
  view: [employee: Employee]
  edit: [employee: Employee]
  remove: [employee: Employee]
}>()

function roleSeverity(role: Employee['role']): TagProps['severity'] {
  if (role === 'admin') return 'danger'
  if (role === 'moderator') return 'warn'
  return 'secondary'
}
</script>

<template>
  <article
    class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40"
  >
    <button
      class="flex w-full items-start gap-3 text-left"
      type="button"
      @click="$emit('view', employee)"
    >
      <Avatar
        v-if="employee.image"
        :image="employee.image"
        shape="circle"
        class="size-12 shrink-0 bg-slate-100"
      />
      <Avatar
        v-else
        :label="employeeInitials(employee)"
        shape="circle"
        class="size-12 shrink-0 bg-indigo-100 font-bold text-indigo-700"
      />
      <span class="min-w-0 flex-1">
        <span class="block truncate font-bold text-slate-900">
          {{ employeeFullName(employee) }}
        </span>
        <span class="mt-0.5 block truncate text-sm text-slate-500">{{ employee.title }}</span>
        <span class="mt-2 flex flex-wrap items-center gap-2">
          <Tag
            :value="roleLabels[employee.role]"
            :severity="roleSeverity(employee.role)"
            rounded
          />
          <span class="text-xs font-semibold text-slate-400">{{ employeeCode(employee.id) }}</span>
        </span>
      </span>
      <i class="pi pi-chevron-right mt-1 text-xs text-slate-300" />
    </button>

    <div class="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-sm">
      <div class="min-w-0">
        <p class="text-xs text-slate-400">Departemen</p>
        <p class="truncate font-medium text-slate-700">{{ employee.department }}</p>
      </div>
      <div class="min-w-0">
        <p class="text-xs text-slate-400">Lokasi</p>
        <p class="truncate font-medium text-slate-700">{{ employee.city }}</p>
      </div>
    </div>

    <div class="mt-3 flex justify-end gap-1">
      <Button
        icon="pi pi-pencil"
        label="Edit"
        severity="secondary"
        text
        size="small"
        @click="$emit('edit', employee)"
      />
      <Button
        icon="pi pi-trash"
        label="Hapus"
        severity="danger"
        text
        size="small"
        :loading="deleting"
        @click="$emit('remove', employee)"
      />
    </div>
  </article>
</template>
