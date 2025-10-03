<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <Sidebar
      class="border-r border-gray-200"
      :is-open="isSidebarOpen"
      @toggleSidebar="toggleSidebar"
    />

    <!-- Main wrapper -->
    <div class="flex-1 flex flex-col">
      <!-- Navbar -->
      <Navbar />

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'

const isSidebarOpen = ref(true)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>
