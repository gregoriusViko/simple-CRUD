import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { employeesApi } from '../api/employeesApi'
import type { Employee, EmployeeInput } from '../types/employee'

/*
*/

export const useEmployeesStore = defineStore('employees', () => {
  const employees = ref<Employee[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const deletingId = ref<number | null>(null)
  const error = ref<string | null>(null)
  const loaded = ref(false)
  const sessionEmployeeIds = new Set<number>()

  const total = computed(() => employees.value.length)

  async function loadEmployees(force = false) {
    if (loaded.value && !force) return

    loading.value = true
    error.value = null

    try {
      employees.value = await employeesApi.getAll()
      sessionEmployeeIds.clear()
      loaded.value = true
    } catch (loadError) {
      error.value = loadError instanceof Error ? loadError.message : 'Data karyawan gagal dimuat.'
    } finally {
      loading.value = false
    }
  }

  async function createEmployee(input: EmployeeInput) {
    saving.value = true

    try {
      let created = await employeesApi.create(input)

      if (employees.value.some((employee) => employee.id === created.id)) {
        const nextId = Math.max(0, ...employees.value.map((employee) => employee.id)) + 1
        created = { ...created, id: nextId }
      }

      sessionEmployeeIds.add(created.id)
      employees.value.unshift(created)
      return created
    } finally {
      saving.value = false
    }
  }

  async function updateEmployee(id: number, input: EmployeeInput) {
    saving.value = true

    try {
      const updated = sessionEmployeeIds.has(id)
        ? { ...input, id }
        : await employeesApi.update(id, input)
      const index = employees.value.findIndex((employee) => employee.id === id)

      if (index !== -1) {
        employees.value[index] = {
          ...employees.value[index],
          ...updated,
          id,
        }
      }

      return employees.value[index]
    } finally {
      saving.value = false
    }
  }

  async function deleteEmployee(id: number) {
    deletingId.value = id

    try {
      if (!sessionEmployeeIds.has(id)) {
        await employeesApi.remove(id)
      }

      employees.value = employees.value.filter((employee) => employee.id !== id)
      sessionEmployeeIds.delete(id)
    } finally {
      deletingId.value = null
    }
  }

  return {
    employees,
    total,
    loading,
    saving,
    deletingId,
    error,
    loadEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  }
})
