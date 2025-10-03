<template>
  <header
    class="bg-white border-b px-6 py-3 grid grid-cols-3 items-center shadow-sm sticky top-0 z-50"
  >
    <!-- Kiri (bisa ditambah logo nanti, kosong dulu biar simetris) -->
    <div></div>

    <!-- Tengah (Search Bar) -->
    <div class="flex justify-center">
      <div class="flex w-full max-w-md rounded-lg shadow-sm overflow-hidden">
        <input
          type="text"
          placeholder="Cari sesuatu..."
          v-model="query"
          class="flex-1 border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          @click="onSearch(query)"
          class="bg-blue-500 text-white px-4 hover:bg-blue-600 transition-all duration-300 flex items-center justify-center"
        >
          <MagnifyingGlassIcon class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Kanan (aksi) -->
    <div class="flex items-center justify-end gap-4">
      <!-- Notifikasi -->
      <button
        title="Notifikasi"
        class="p-2 rounded-full hover:bg-gray-100 relative transition-all duration-300"
      >
        <BellIcon class="w-6 h-6 text-gray-600" />
        <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      <!-- Settings -->
      <button
        @click="$router.push('/admin/profile')"
        title="Pengaturan"
        class="p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
      >
        <Cog6ToothIcon class="w-6 h-6 text-gray-600" />
      </button>

      <!-- Profil (foto kosong dulu) -->
      <div
        class="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition-all duration-300"
      >
        <div
          class="w-9 h-9 rounded-full border flex items-center justify-center bg-gray-200 text-gray-500 text-xs font-medium"
        >
          -
        </div>
        <div class="text-sm leading-tight">
          <div class="font-semibold text-gray-800">{{ profile.name || 'User' }}</div>
          <div class="text-xs text-gray-500">{{ profile.role || 'Role' }}</div>
        </div>
      </div>

      <!-- Logout -->
      <button
        @click="logout"
        title="Logout"
        class="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-all duration-300"
      >
        <ArrowRightOnRectangleIcon class="w-5 h-5" />
        <span class="hidden sm:inline font-medium">Logout</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import router from '@/router'

// Heroicons
import {
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/vue/24/solid'

const query = ref('')
const profile = ref({ name: 'Admin', avatar: null, role: 'Admin' })

const onSearch = (q) => {
  console.log('search query', q)
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>
