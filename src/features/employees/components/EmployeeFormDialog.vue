<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useEmployeesStore } from '../stores/useEmployeesStore'
import type { Employee, EmployeeInput, EmployeeRole } from '../types/employee'

const props = defineProps<{
  employee?: Employee | null
}>()

const visible = defineModel<boolean>('visible', {
  default: false
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  saved: [employee: Employee]
}>()

interface EmployeeForm extends Omit<EmployeeInput, 'age'> {
  age: number | null
}

const emptyForm = (): EmployeeForm => ({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  age: null,
  gender: '',
  role: 'user',
  title: '',
  department: '',
  company: '',
  city: '',
  country: '',
})

const store = useEmployeesStore()
const toast = useToast()
const form = reactive<EmployeeForm>(emptyForm())
const errors = reactive<Record<string, string>>({})
const submitError = ref('')

const roleOptions: { label: string; value: EmployeeRole }[] = [
  { label: 'Karyawan', value: 'user' },
  { label: 'Moderator', value: 'moderator' },
  { label: 'Admin', value: 'admin' },
]

const genderOptions = [
  { label: 'Perempuan', value: 'female' },
  { label: 'Laki-laki', value: 'male' },
]

watch(
  visible,
  (isOpen) => {
    if (!isOpen) return

    Object.keys(errors).forEach((key) => delete errors[key])
    submitError.value = ''

    if (props.employee) {
      Object.assign(form, {
        firstName: props.employee.firstName,
        lastName: props.employee.lastName,
        email: props.employee.email,
        phone: props.employee.phone === '-' ? '' : props.employee.phone,
        age: props.employee.age,
        gender: props.employee.gender,
        role: props.employee.role,
        title: props.employee.title,
        department: props.employee.department,
        company: props.employee.company === '-' ? '' : props.employee.company,
        city: props.employee.city === '-' ? '' : props.employee.city,
        country: props.employee.country === '-' ? '' : props.employee.country,
      })
      return
    }

    Object.assign(form, emptyForm())
  },
)

function closeDialog() {
  if (!store.saving) visible.value = false
}

function validate() {
  Object.keys(errors).forEach((key) => delete errors[key])

  if (!form.firstName.trim()) errors.firstName = 'Nama depan wajib diisi.'
  if (!form.lastName.trim()) errors.lastName = 'Nama belakang wajib diisi.'
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Gunakan format email yang valid.'
  if (!form.department.trim()) errors.department = 'Departemen wajib diisi.'
  if (!form.title.trim()) errors.title = 'Jabatan wajib diisi.'
  if (form.age === null || form.age < 18 || form.age > 75) {
    errors.age = 'Usia harus antara 18–75 tahun.'
  }

  return Object.keys(errors).length === 0
}

async function submit() {
  if (!validate()) return

  submitError.value = ''
  const payload: EmployeeInput = {
    ...form,
    age: form.age!,
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim(),
    phone: form.phone.trim() || '-',
    title: form.title.trim(),
    department: form.department.trim(),
    company: form.company.trim() || '-',
    city: form.city.trim() || '-',
    country: form.country.trim() || '-',
  }

  try {
    const saved = props.employee
      ? await store.updateEmployee(props.employee.id, payload)
      : await store.createEmployee(payload)

    if (!saved) throw new Error('Data karyawan tidak ditemukan.')

    emit('saved', saved)
    visible.value = false
    toast.add({
      severity: 'success',
      summary: props.employee ? 'Perubahan tersimpan' : 'Karyawan ditambahkan',
      detail: `${saved.firstName} ${saved.lastName} berhasil disimpan.`,
      life: 3000,
    })
  } catch (error) {
    submitError.value =
      error instanceof Error ? error.message : 'Data gagal disimpan. Silakan coba lagi.'
  }
}
</script>

<template>
  <Dialog :visible="visible" modal :draggable="false" :closable="!store.saving" :style="{ width: 'min(94vw, 720px)' }"
    :header="employee ? 'Edit data karyawan' : 'Tambah karyawan'" @update:visible="emit('update:visible', $event)">
    <p class="-mt-1 mb-6 text-sm leading-6 text-slate-500">
      {{
        employee
          ? 'Perbarui informasi profil dan pekerjaan karyawan.'
          : 'Tambahkan anggota baru ke direktori tim.'
      }}
    </p>

    <form id="employee-form" class="space-y-6" autocomplete="off" @submit.prevent="submit">
      <section>
        <h3 class="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
          Informasi pribadi
        </h3>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-1.5">
            <label for="firstName" class="text-sm font-medium text-slate-700">Nama depan</label>
            <InputText id="firstName" v-model="form.firstName" class="w-full" :invalid="Boolean(errors.firstName)"
              autocomplete="given-name" placeholder="Contoh: Budi" />
            <p v-if="errors.firstName" class="text-xs text-red-600">{{ errors.firstName }}</p>
          </div>
          <div class="space-y-1.5">
            <label for="lastName" class="text-sm font-medium text-slate-700">Nama belakang</label>
            <InputText id="lastName" v-model="form.lastName" class="w-full" :invalid="Boolean(errors.lastName)"
              autocomplete="family-name" placeholder="Contoh: Santoso" />
            <p v-if="errors.lastName" class="text-xs text-red-600">{{ errors.lastName }}</p>
          </div>
          <div class="space-y-1.5">
            <label for="email" class="text-sm font-medium text-slate-700">Email</label>
            <InputText id="email" v-model="form.email" type="email" class="w-full" :invalid="Boolean(errors.email)"
              autocomplete="off" placeholder="nama@perusahaan.com" />
            <p v-if="errors.email" class="text-xs text-red-600">{{ errors.email }}</p>
          </div>
          <div class="space-y-1.5">
            <label for="phone" class="text-sm font-medium text-slate-700">Nomor telepon</label>
            <InputText id="phone" v-model="form.phone" class="w-full" autocomplete="off"
              placeholder="+62 812 3456 7890" />
          </div>
          <div class="space-y-1.5">
            <label for="age" class="text-sm font-medium text-slate-700">Usia</label>
            <InputNumber input-id="age" v-model="form.age" class="w-full" input-class="w-full"
              :invalid="Boolean(errors.age)" :min="18" :max="75" :use-grouping="false" placeholder="25" />
            <p v-if="errors.age" class="text-xs text-red-600">{{ errors.age }}</p>
          </div>
          <div class="space-y-1.5">
            <label for="gender" class="text-sm font-medium text-slate-700">Gender</label>
            <Select input-id="gender" v-model="form.gender" :options="genderOptions" option-label="label"
              option-value="value" class="w-full" placeholder="Pilih gender" />
          </div>
        </div>
      </section>

      <section>
        <h3 class="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
          Informasi pekerjaan
        </h3>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-1.5">
            <label for="title" class="text-sm font-medium text-slate-700">Jabatan</label>
            <InputText id="title" v-model="form.title" class="w-full" :invalid="Boolean(errors.title)"
              placeholder="Contoh: UI Designer" />
            <p v-if="errors.title" class="text-xs text-red-600">{{ errors.title }}</p>
          </div>
          <div class="space-y-1.5">
            <label for="department" class="text-sm font-medium text-slate-700">Departemen</label>
            <InputText id="department" v-model="form.department" class="w-full" :invalid="Boolean(errors.department)"
              placeholder="Contoh: Engineering" />
            <p v-if="errors.department" class="text-xs text-red-600">
              {{ errors.department }}
            </p>
          </div>
          <div class="space-y-1.5">
            <label for="company" class="text-sm font-medium text-slate-700">Perusahaan</label>
            <InputText id="company" v-model="form.company" class="w-full" placeholder="Nama perusahaan" />
          </div>
          <div class="space-y-1.5">
            <label for="role" class="text-sm font-medium text-slate-700">Hak akses</label>
            <Select input-id="role" v-model="form.role" :options="roleOptions" option-label="label" option-value="value"
              class="w-full" />
          </div>
          <div class="space-y-1.5">
            <label for="city" class="text-sm font-medium text-slate-700">Kota</label>
            <InputText id="city" v-model="form.city" class="w-full" placeholder="Jakarta" />
          </div>
          <div class="space-y-1.5">
            <label for="country" class="text-sm font-medium text-slate-700">Negara</label>
            <InputText id="country" v-model="form.country" class="w-full" placeholder="Indonesia" />
          </div>
        </div>
      </section>

      <div v-if="submitError" class="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
        <i class="pi pi-exclamation-circle mt-0.5" />
        <span>{{ submitError }}</span>
      </div>
    </form>

    <template #footer>
      <div class="flex w-full justify-end gap-2 border-t border-slate-100 pt-4">
        <Button label="Batal" severity="secondary" text :disabled="store.saving" @click="closeDialog" />
        <Button type="submit" form="employee-form" :label="employee ? 'Simpan perubahan' : 'Tambah karyawan'"
          icon="pi pi-check" :loading="store.saving" />
      </div>
    </template>
  </Dialog>
</template>
