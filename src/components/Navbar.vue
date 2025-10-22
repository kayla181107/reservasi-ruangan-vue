<template>
  <header
    class="flex items-center justify-between px-8 py-4 bg-white shadow-sm border-b border-gray-100"
  >
    <!-- Kiri: Hamburger + Logo -->
    <div class="flex items-center gap-6">
      <button
        class="p-3 rounded-md hover:bg-gray-100 transition-all"
        @click="$emit('toggleSidebar')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-7 h-7 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <!-- Logo -->
      <img
        src="/images/logo.jpg"
        alt="logo"
        class="h-25 w-auto object-contain"
      />
    </div>

    <!-- Kanan: Profil -->
    <router-link
      to="/admin/profile"
      class="flex items-center gap-3 bg-gray-100 px-5 py-3 rounded-xl shadow-sm hover:bg-gray-200 transition-all"
    >
      <!-- Foto profil user -->
      <div v-if="profile.photo" class="w-11 h-11">
        <img
          :src="profile.photo"
          alt="Foto Profil"
          class="w-11 h-11 rounded-full object-cover border border-gray-300"
        />
      </div>

      <!-- Kalau belum ada foto profil -->
      <div
        v-else
        class="w-11 h-11 rounded-full bg-[#0B5C75] text-white flex items-center justify-center text-base font-bold"
      >
        {{ profileInitial }}
      </div>

      <!-- Nama user yang login -->
      <span class="text-[#0B5C75] text-base font-semibold capitalize">
        Hi, {{ profile.name }}
      </span>
    </router-link>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "@/api/axios";

const profile = ref({
  name: "",
  photo: "",
});

const profileInitial = computed(() => {
  return profile.value.name
    ? profile.value.name.charAt(0).toUpperCase()
    : "-";
});

onMounted(async () => {
  try {
    // 🔥 Ambil data profil user dari backend
    const res = await api.get("/user/profile");

    // Sesuaikan struktur JSON respons dari backend kamu
    // Misal { data: { name: "Kayla", photo: "profil.jpg" } }
    profile.value = {
      name:
        res.data?.data?.name ||
        res.data?.name ||
        "",
      photo: res.data?.data?.photo
        ? res.data.data.photo.startsWith("http")
          ? res.data.data.photo
          : `/storage/${res.data.data.photo}`
        : "",
    };

    // Simpan nama ke localStorage agar tetap tampil saat refresh
    if (profile.value.name) {
      localStorage.setItem("user_name", profile.value.name);
    }
  } catch (error) {
    console.error("Gagal memuat profil user:", error);

    // Kalau API gagal, ambil nama terakhir dari localStorage
    const storedName = localStorage.getItem("user_name");
    if (storedName) {
      profile.value.name = storedName;
    }
  }
});
</script>

<style scoped>
header {
  font-family: "Inter", sans-serif;
}
</style>
