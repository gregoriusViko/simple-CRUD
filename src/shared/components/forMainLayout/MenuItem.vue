<template>
  <li>
    <!-- 1. JIKA DIA ADALAH MENU BIASA YANG PINDAH HALAMAN -->
    <router-link v-if="to && !hasSubmenu" :to="to" custom v-slot="{ href, navigate, isExactActive }">
      <a :href="href" @click="navigate" v-ripple
        class="flex items-center cursor-pointer p-3 rounded-border duration-150 transition-colors p-ripple" :class="isExactActive
          ? 'text-indigo-600 bg-slate-100'
          : 'text-slate-700 hover:bg-slate-100'">
        <span class="mr-2">
          <slot name="icon"></slot>
        </span>
        <span class="font-medium text-sm">{{ label }}</span>
      </a>
    </router-link>

    <!-- 2. JIKA DIA ADALAH MENU DROPDOWN (Punya Submenu) -->
    <!-- Tambahkan event @click="isOpen = !isOpen" untuk mengubah status -->
    <a v-else-if="hasSubmenu" @click="isOpen = !isOpen" v-ripple
      class="flex items-center cursor-pointer p-3 rounded-border text-surface-700 hover:bg-surface-100 dark:hover:bg-surface-700 duration-150 transition-colors p-ripple">
      <span class="mr-2">
        <slot name="icon"></slot>
      </span>
      <span class="font-medium text-sm">{{ label }}</span>
      <span class="ml-auto">
        <!-- Tambahkan class transition dan rotasi dinamis di sini -->
        <i class="pi pi-chevron-down transition-transform duration-300" :class="{ 'rotate-180': isOpen }"></i>
      </span>
    </a>

    <!-- WADAH SUBMENU -->
    <div v-if="hasSubmenu" class="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
      :class="isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'">
      <ul v-if="hasSubmenu" class="min-h-0 overflow-hidden transition-opacity duration-300 ease-out m-0 p-0 pl-4"
        :class="isOpen ? 'opacity-100' : 'opacity-0'">
        <slot name="submenu"></slot>
      </ul>
    </div>
  </li>
</template>

<script setup lang="ts">
import { useSlots, computed, ref } from 'vue'; // Import 'ref' ditambahkan

defineProps({
  label: { type: String, required: true },
  to: { type: [String, Object], default: null }
});

const slots = useSlots();
const hasSubmenu = computed(() => !!slots.submenu);

// State untuk melacak apakah submenu sedang terbuka atau tertutup
const isOpen = ref(false);
</script>
