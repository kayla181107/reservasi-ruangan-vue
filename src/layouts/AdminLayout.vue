<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <Sidebar
      v-show="isSidebarOpen" 
      class="border-r border-gray-200 transition-all duration-300"
      :is-open="isSidebarOpen"
      @toggleSidebar="toggleSidebar"
    />

    <!-- Main wrapper -->
    <div class="flex-1 flex flex-col">
      <!-- Navbar -->
      <Navbar @toggleSidebar="toggleSidebar" />

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

const isSidebarOpen = ref(false) // default: sidebar disembunyikan

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>
