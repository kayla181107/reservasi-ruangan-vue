<template>
  <header
    class="flex items-center justify-between px-7 py-2 bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50"
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

      <div class="flex items-center gap-2">
        <img
          src="/images/logo.jpg"
          alt="logo"
          class="h-23 w-auto object-contain"
        />
        
      </div>
    </div>

    <router-link
      to="/admin/profile"
      class="flex items-center gap-3 bg-gray-100 px-5 py-3 rounded-xl shadow-sm hover:bg-gray-200 transition-all"
    >
      <div v-if="profile.photo" class="w-10 h-10">
        <img
          :src="profile.photo"
          alt="Foto Profil"
          class="w-10 h-10 rounded-full object-cover border border-gray-300"
        />
      </div>

      <div
        v-else
        class="w-10 h-10 rounded-full bg-[#0B5C75] text-white flex items-center justify-center text-sm font-bold"
      >
        {{ profileInitial }}
      </div>

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

const profileInitial = computed(() =>
  profile.value.name ? profile.value.name.charAt(0).toUpperCase() : "-"
);

onMounted(async () => {
  try {
    const res = await api.get("/profile");
    profile.value = {
      name: res.data?.data?.name || res.data?.name || "",
      photo: res.data?.data?.photo
        ? res.data.data.photo.startsWith("http")
          ? res.data.data.photo
          : `/storage/${res.data.data.photo}`
        : "",
    };

    if (profile.value.name) {
      localStorage.setItem("user_name", profile.value.name);
    }
  } catch (error) {
    const storedName = localStorage.getItem("user_name");
    if (storedName) profile.value.name = storedName;
  }
});
</script>

<style scoped>
header {
  font-family: "Inter", sans-serif;
}
</style>
