export type EmployeeRole = 'admin' | 'moderator' | 'user'

export interface Employee {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  age: number
  gender: string
  image?: string
  role: EmployeeRole
  title: string
  department: string
  company: string
  city: string
  country: string
}

export type EmployeeInput = Omit<Employee, 'id' | 'image'>

export interface DummyJsonUser {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  age?: number
  gender?: string
  image?: string
  role?: EmployeeRole
  address?: {
    city?: string
    country?: string
  }
  company?: {
    department?: string
    name?: string
    title?: string
  }
}

export interface DummyJsonUsersResponse {
  users: DummyJsonUser[]
  total: number
  skip: number
  limit: number
}
