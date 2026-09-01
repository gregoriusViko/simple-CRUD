import { computed, type Ref } from 'vue'
import type { Employee } from '../types/employee'

export function useEmployeeStats(employees: Ref<Employee[]>) {
  const locationCount = computed(
    () => new Set(employees.value.map((employee) => `${employee.city}-${employee.country}`)).size,
  )

  const adminCount = computed(
    () => employees.value.filter((employee) => employee.role === 'admin').length,
  )

  return { locationCount, adminCount }
}
