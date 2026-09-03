<script setup lang="ts">
import { z } from 'zod';
import { useValidateInput } from '@/shared/composables/useValidateInput';

// --- 1. Definisikan Schema ---
const schema = z.object({
  email: z
    .string('Email wajib diisi') // Catatan: perbaikan cara penulisan z.string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
  password: z
    .string('Password wajib diisi') // Catatan: perbaikan cara penulisan z.string()
    .min(1, 'Password wajib diisi')
    .min(8, 'Minimal 8 karakter'),
});

// --- 2. Panggil Composable ---
const { resolver, fieldsToValidateOnUpdate, markTouched, onSubmit } = useValidateInput(
  schema,
  (values) => {
    // Fungsi ini HANYA terpanggil jika validasi berhasil (!event.valid sudah dihandle di dalam composable)
    console.log('Data valid dan siap dikirim:', values);

    // Contoh: await api.login(values.email, values.password);
  }
);
</script>

<template>
  <Form
    :resolver="resolver"
    :validateOnBlur="true"
    :validateOnValueUpdate="fieldsToValidateOnUpdate"
    :validateOnSubmit="true"
    @submit="onSubmit"
    class="flex flex-col gap-4 w-80"
  >
    <!-- Email -->
    <FormField name="email" v-slot="$field">
      <label for="email" class="text-sm font-medium">Email</label>
      <InputText
        id="email"
        v-bind="$field"
        type="email"
        placeholder="contoh@email.com"
        class="w-full"
        @blur="markTouched('email')"
      />
      <Message
        v-if="$field.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $field.error?.message }}
      </Message>
    </FormField>

    <!-- Password -->
    <FormField name="password" v-slot="$field">
      <label for="password" class="text-sm font-medium">Password</label>
      <Password
        id="password"
        v-bind="$field"
        placeholder="Min. 8 karakter"
        class="w-full"
        :feedback="false"
        toggleMask
        @blur="markTouched('password')"
      />
      <Message
        v-if="$field.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $field.error?.message }}
      </Message>
    </FormField>

    <Button type="submit" label="Login" class="w-full" />
  </Form>
</template>
