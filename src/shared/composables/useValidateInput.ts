// import { z } from 'zod';
// import { zodResolver } from '@primevue/forms/resolvers/zod';

// export const useValidateInput = (schema: z.ZodObject) => {
//   type FormValues = z.infer<typeof schema>;

//   const resolver = zodResolver(schema);

//   const initialTouched = Object.keys(schema.shape).reduce((acc, key) => {
//     acc[key as keyof FormValues] = false;
//     return acc;
//   }, {} as Record<keyof FormValues, boolean>);
// }

import { ref, computed } from 'vue';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import type { FormSubmitEvent } from '@primevue/forms';
import { z } from 'zod';

export function useValidateInput<T extends z.ZodObject>(
  schema: T,
  onSuccess: (values: z.infer<T>) => void
) {
  type FormValues = z.infer<T>;

  // 1. Generate default 'touched' state otomatis dari schema Zod (tanpa perlu hardcode)
  const initialTouched = Object.keys(schema.shape).reduce((acc, key) => {
    acc[key as keyof FormValues] = false;
    return acc;
  }, {} as Record<keyof FormValues, boolean>);

  const touched = ref(initialTouched);

  const fieldsToValidateOnUpdate = computed(() => {
    return (Object.keys(touched.value) as Array<keyof FormValues>).filter(
      (key) => touched.value[key]
    ) as string[]; // PrimeVue membutuhkan array of string
  });

  // 2. Fungsi untuk menandai satu field
  function markTouched(field: keyof FormValues) {
    touched.value[field] = true;
  }

  // 3. Fungsi untuk menandai semua field (dipakai saat submit gagal)
  function markAllTouched() {
    for (const key in touched.value) {
      touched.value[key as keyof FormValues] = true;
    }
  }

  // 4. Wrapper Submit dari PrimeVue
  function onSubmit(event: FormSubmitEvent) {
    if (!event.valid) {
      markAllTouched(); // Jika tidak valid, munculkan semua error
      return;
    }
    // Jika valid, teruskan data ke callback onSuccess
    onSuccess(event.values as FormValues);
  }

  return {
    resolver: zodResolver(schema),
    touched,
    fieldsToValidateOnUpdate,
    markTouched,
    onSubmit
  };
}
