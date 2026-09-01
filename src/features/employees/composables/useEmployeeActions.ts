import { ref } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import type { Employee } from '../types/employee'
import { employeeFullName } from '../utils/employee'
import { useEmployeesStore } from '../stores/useEmployeesStore' // Sesuaikan path

export function useEmployeeActions() {
  const store = useEmployeesStore()
  const confirm = useConfirm()
  const toast = useToast()

  const formVisible = ref(false)
  const detailsVisible = ref(false)
  const selectedEmployee = ref<Employee | null>(null)
  const editingEmployee = ref<Employee | null>(null)

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

  function handleSaved(employee: Employee) {
    if (selectedEmployee.value?.id === employee.id) {
      selectedEmployee.value = employee
    }
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
          toast.add({ severity: 'success', summary: 'Karyawan dihapus', detail: `${employeeFullName(employee)} telah dihapus.`, life: 3000 })
        } catch (error) {
          toast.add({ severity: 'error', summary: 'Gagal menghapus', detail: error instanceof Error ? error.message : 'Silakan coba lagi.', life: 4000 })
        }
      },
    })
  }

  return {
    formVisible,
    detailsVisible,
    selectedEmployee,
    editingEmployee,
    openCreate,
    openEdit,
    openDetails,
    handleSaved,
    confirmDelete
  }
}
