<template>
  <router-view />
</template>

<script setup>
// tidak perlu logic tambahan, semua layout & page sudah di-handle di router
</script>

<style>
/* optional: global style reset, bisa juga di index.css */
html, body, #app {
  height: 100%;
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
  background-color: #f9fafb;
}
</style>