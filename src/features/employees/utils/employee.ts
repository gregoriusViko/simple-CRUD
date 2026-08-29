import type { Employee, EmployeeRole } from '../types/employee'

export const roleLabels: Record<EmployeeRole, string> = {
  admin: 'Admin',
  moderator: 'Moderator',
  user: 'Karyawan',
}

export function employeeFullName(employee: Pick<Employee, 'firstName' | 'lastName'>) {
  return `${employee.firstName} ${employee.lastName}`.trim()
}

export function employeeInitials(employee: Pick<Employee, 'firstName' | 'lastName'>) {
  return `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`.toUpperCase()
}

export function employeeCode(id: number) {
  return `EMP-${id.toString().padStart(4, '0')}`
}
