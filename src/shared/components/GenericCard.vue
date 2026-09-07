<script setup lang="ts">
import type { TagProps } from 'primevue/tag'
import { computed } from 'vue';

// Mendefinisikan tipe data untuk array metadata (grid 2 kolom di tengah)
export interface CardMetadata {
  label: string
  value: string | number
}

const props = withDefaults(
  defineProps<{
    id: string | number
    title: string | number
    subtitle?: string | number
    image?: string | null
    initials?: string
    badgeText?: string
    badgeSeverity?: TagProps['severity']
    code?: string
    metadata?: CardMetadata[]
    deleting?: boolean
  }>(),
  {
    subtitle: '',
    image: null,
    initials: '',
    badgeText: '',
    badgeSeverity: 'secondary',
    code: '',
    metadata: () => [],
    deleting: false
  }
)

const titleFormatter = computed(() => String(props.title))

defineEmits<{
  view: [id: string | number]
  edit: [id: string | number]
  remove: [id: string | number]
}>()
</script>

<template>
  <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40">
    <button class="flex w-full items-start gap-3 text-left" type="button" @click="$emit('view', id)">
      <Avatar v-if="image" :image="image" shape="circle" class="size-12 shrink-0 bg-slate-100" />
      <Avatar v-else :label="titleFormatter.charAt(0).toUpperCase()" shape="circle"
        class="size-12 shrink-0 bg-indigo-100 font-bold text-indigo-700" />

      <span class="min-w-0 flex-1">
        <span class="block truncate font-bold text-slate-900">
          {{ title }}
        </span>
        <span v-if="subtitle" class="mt-0.5 block truncate text-sm text-slate-500">
          {{ subtitle }}
        </span>

        <span v-if="badgeText || code" class="mt-2 flex flex-wrap items-center gap-2">
          <Tag v-if="badgeText" :value="badgeText" :severity="badgeSeverity" rounded />
          <span v-if="code" class="text-xs font-semibold text-slate-400">
            {{ code }}
          </span>
        </span>
      </span>
      <i class="pi pi-chevron-right mt-1 text-xs text-slate-300" />
    </button>

    <!-- Grid Metadata dinamis: akan dirender sesuai jumlah item di array metadata -->
    <div v-if="metadata && metadata.length > 0"
      class="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-sm">
      <div v-for="(item, index) in metadata" :key="index" class="min-w-0">
        <p class="text-xs text-slate-400">{{ item.label }}</p>
        <p class="truncate font-medium text-slate-700">{{ item.value }}</p>
      </div>
    </div>

    <div class="mt-3 flex justify-end gap-1">
      <Button icon="pi pi-pencil" label="Edit" severity="secondary" text size="small" @click="$emit('edit', id)" />
      <Button icon="pi pi-trash" label="Hapus" severity="danger" text size="small" :loading="deleting"
        @click="$emit('remove', id)" />
    </div>
  </article>
</template>
