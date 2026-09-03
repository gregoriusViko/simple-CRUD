<script setup lang="ts">
import { ref } from 'vue';
import { Form, FormField } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import type { FormSubmitEvent } from '@primevue/forms';

// --- Schema ---
const schema = z.object({
  email: z
    .string('Email wajib diisi')
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
  password: z
    .string('Password wajib diisi')
    .min(1, 'Password wajib diisi')
    .min(8, 'Minimal 8 karakter'),
});

type FormValues = z.infer<typeof schema>;

// --- Resolver ---
const resolver = zodResolver(schema);

// --- Touched tracking (untuk hybrid blur → real-time) ---
const touched = ref<Record<keyof FormValues, boolean>>({
  email: false,
  password: false,
});

function markTouched(field: keyof FormValues) {
  touched.value[field] = true;
}

// --- Submit ---
function onSubmit(event: FormSubmitEvent) {
  if (!event.valid){
    touched.value = {
      email: true,
      password: true,
    };
    return;
  }
  const values = event.values as FormValues;
  console.log('Data valid:', values);
}
</script>

<template>
  <Form
    :resolver="resolver"
    :validateOnBlur="true"
    :validateOnValueUpdate="(Object.keys(touched) as (keyof FormValues)[]).filter(k => touched[k])"
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
