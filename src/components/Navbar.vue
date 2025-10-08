<template>
  <header
    class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
           px-6 py-3 grid grid-cols-3 items-center shadow-md sticky top-0 z-50 text-white"
  >
    <!-- Kiri (Logo kecil / kosong biar balance) -->
    <div class="flex items-center">
      <h1 class="text-lg font-bold tracking-wide">Reservation</h1>
    </div>

    <!-- Tengah (Search Bar) -->
    <div class="flex justify-center">
      <div
        class="flex w-full max-w-md rounded-full overflow-hidden shadow-md bg-white/20 backdrop-blur-md border border-white/30"
      >
        <input
          type="text"
          placeholder="Cari sesuatu..."
          v-model="query"
          class="flex-1 px-4 py-2 text-sm bg-transparent placeholder-white/80 text-white focus:outline-none"
        />
        <button
          @click="onSearch(query)"
          class="px-4 bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center"
        >
          <MagnifyingGlassIcon class="w-5 h-5 text-white" />
        </button>
      </div>
    </div>

    <!-- Kanan (aksi) -->
    <div class="flex items-center justify-end gap-4">
      <!-- Notifikasi -->
      <button
        title="Notifikasi"
        class="p-2 rounded-full hover:bg-white/20 relative transition-all duration-300"
      >
        <BellIcon class="w-6 h-6 text-white" />
        <span
          class="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full shadow-md"
        ></span>
      </button>

      <!-- Settings -->
      <button
        @click="$router.push('/admin/profile')"
        title="Pengaturan"
        class="p-2 rounded-full hover:bg-white/20 transition-all duration-300"
      >
        <Cog6ToothIcon class="w-6 h-6 text-white" />
      </button>

      <!-- Profil -->
      <div
        class="flex items-center gap-3 px-3 py-2 rounded-full bg-white/10 backdrop-blur-md cursor-pointer hover:bg-white/20 transition-all duration-300"
      >
        <div
          class="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center bg-white/20 text-white text-xs font-medium"
        >
          {{ profile.name?.charAt(0) || '-' }}
        </div>
        <div class="text-sm leading-tight hidden sm:block">
          <div class="font-semibold">{{ profile.name || 'User' }}</div>
          <div class="text-xs text-white/80">{{ profile.role || 'Role' }}</div>
        </div>
      </div>

      <!-- Logout -->
      <button
        @click="logout"
        title="Logout"
        class="flex items-center gap-1 px-4 py-2 bg-rose-500 rounded-full shadow hover:bg-rose-600 transition-all duration-300"
      >
        <ArrowRightOnRectangleIcon class="w-5 h-5" />
        <span class="hidden sm:inline font-medium">Logout</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import router from "@/router";

// Heroicons
import {
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/24/solid";

const query = ref("");
const profile = ref({ name: "Admin", avatar: null, role: "Administrator" });

const onSearch = (q) => {
  console.log("search query", q);
};

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};
</script>
