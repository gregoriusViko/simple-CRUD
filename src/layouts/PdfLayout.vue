<!-- layouts/BookLayout.vue -->
<template>
  <div class="book-shell">
    <!-- Toolbar: zoom, navigasi halaman -->
    <div class="book-toolbar">
      <Button icon="pi pi-minus" @click="zoomOut" />
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <Button icon="pi pi-plus" @click="zoomIn" />
    </div>

    <!-- Area viewer dengan background gelap -->
    <div class="book-stage">
      <RouterView />  <!-- BookViewer.vue masuk di sini -->
    </div>
  </div>
</template>

<style scoped>
.book-shell {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.book-toolbar {
  height: 48px;
  background: #333;
}
.book-stage {
  flex: 1;
  background: #555;  /* "meja" gelap di sini, bukan di body */
  overflow-y: auto;
  padding: 40px;
}
</style>
