<template>
  <GenericExcelExport
    :data="users"
    :columns="[
      { key: 'id', header: 'ID' },
      { key: 'name', header: 'Nama' },
      { key: 'email', header: 'Email' },
      { key: 'role', header: 'Peran' }
    ]"
    fileName="users"
  />
</template>

<script setup lang="ts">
import GenericExcelExport from '@/shared/components/GenericExcelExport.vue';
import { ref } from 'vue';
const users = ref([
  { id: 1, name: 'Budi Santoso', email: 'budi@example.com', role: 'Admin' },
  { id: 2, name: 'Siti Aminah', email: 'siti@example.com', role: 'User' },
  { id: 3, name: 'Andi Wijaya', email: 'andi@example.com', role: 'User' }
]);
</script>
