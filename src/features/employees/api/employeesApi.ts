import type {
  DummyJsonUser,
  DummyJsonUsersResponse,
  Employee,
  EmployeeInput,
} from '../types/employee'
import { request } from '@/services/dummyJSON.api'

function toEmployee(user: DummyJsonUser): Employee {
  return {
    id: Number(user.id),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone ?? '-',
    age: user.age ?? 18,
    gender: user.gender ?? 'other',
    image: user.image,
    role: user.role ?? 'user',
    title: user.company?.title ?? 'Staff',
    department: user.company?.department ?? 'General',
    company: user.company?.name ?? '-',
    city: user.address?.city ?? '-',
    country: user.address?.country ?? '-',
  }
}

function toApiPayload(employee: EmployeeInput) {
  return {
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    phone: employee.phone,
    age: employee.age,
    gender: employee.gender,
    role: employee.role,
    address: {
      city: employee.city,
      country: employee.country,
    },
    company: {
      department: employee.department,
      name: employee.company,
      title: employee.title,
    },
  }
}

export const employeesApi = {
  async getAll() {
    const fields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'age',
      'gender',
      'image',
      'role',
      'address',
      'company',
    ].join(',')
    const response = await request<DummyJsonUsersResponse>(
      `/users?limit=0&select=${encodeURIComponent(fields)}`,
    )

    return response.users.map(toEmployee)
  },

  async create(employee: EmployeeInput) {
    const response = await request<DummyJsonUser>('/users/add', {
      method: 'POST',
      body: JSON.stringify(toApiPayload(employee)),
    })

    return toEmployee(response)
  },

  async update(id: number, employee: EmployeeInput) {
    const response = await request<DummyJsonUser>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(toApiPayload(employee)),
    })

    return toEmployee(response)
  },

  async remove(id: number) {
    await request<DummyJsonUser & { isDeleted: boolean }>(`/users/${id}`, {
      method: 'DELETE',
    })
  },
}
