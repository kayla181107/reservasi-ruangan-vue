
<template>
  <div id="app" class="min-h-screen flex flex-col bg-gray-50 text-gray-800">
    <!-- Transisi antar halaman -->
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script setup>
// Semua logic global (Pinia, router, dll) sudah diatur di main.js
</script>

<style>
/* Reset dan global styling */
html, body, #app {
  height: 100%;
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
  background-color: #f9fafb;
}

/* Animasi transisi antar halaman */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Tambahan opsional: smoothing font dan warna link */
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

</style>

