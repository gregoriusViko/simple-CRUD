import { ref, computed, type Ref } from 'vue'
import type { Employee, EmployeeRole } from '../types/employee'
import { employeeFullName, employeeCode } from '../utils/employee'

export function useEmployeeFilters(employees: Ref<Employee[]>) {
  const search = ref('')
  const selectedDepartment = ref<string | null>(null)
  const selectedRole = ref<EmployeeRole | null>(null)

  const departments = computed(() =>
    [...new Set(employees.value.map((employee) => employee.department))]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b)),
  )

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

  const hasFilters = computed(() =>
    Boolean(search.value || selectedDepartment.value || selectedRole.value),
  )

  function clearFilters() {
    search.value = ''
    selectedDepartment.value = null
    selectedRole.value = null
  }

  return {
    search,
    selectedDepartment,
    selectedRole,
    departments,
    filteredEmployees,
    hasFilters,
    clearFilters,
  }
}
