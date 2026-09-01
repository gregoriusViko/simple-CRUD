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
      v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-slidedown', leaveToClass: 'hidden', leaveActiveClass: 'animate-slideup' }"
      class="flex items-center cursor-pointer p-3 rounded-border text-surface-700 dark:text-surface-100 hover:bg-surface-100 dark:hover:bg-surface-700 duration-150 transition-colors p-ripple">
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
    <ul v-if="hasSubmenu"
      class="list-none py-0 pl-4 pr-0 m-0 hidden overflow-y-hidden transition-all duration-[400ms] ease-in-out">
      <slot name="submenu"></slot>
    </ul>
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
