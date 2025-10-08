<template>
  <div
    class="w-64 h-screen flex flex-col shadow-xl border-r border-white/20 animate-slideIn
           bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 text-white"
  >
    <!-- Logo -->
    <div class="p-6 border-b border-white/20">
      <h2 class="text-2xl font-extrabold text-white">Admin </h2>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-4 space-y-2">
      <router-link
        to="/admin"
        class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ease-in-out hover:bg-white/20 group"
        active-class="bg-white/30 font-semibold shadow-sm"
      >
        <HomeIcon class="w-5 h-5 mr-3 text-white group-hover:scale-110 transition" />
        Dashboard
      </router-link>

      <router-link
        to="/admin/rooms"
        class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ease-in-out hover:bg-white/20 group"
        active-class="bg-white/30 font-semibold shadow-sm"
      >
        <BuildingOfficeIcon class="w-5 h-5 mr-3 text-white group-hover:scale-110 transition" />
        Rooms
      </router-link>

      <router-link
        to="/admin/reservations"
        class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ease-in-out hover:bg-white/20 group"
        active-class="bg-white/30 font-semibold shadow-sm"
      >
        <CalendarDaysIcon class="w-5 h-5 mr-3 text-white group-hover:rotate-12 transition" />
        Reservations
      </router-link>

      <router-link
        to="/admin/fixed-schedules"
        class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ease-in-out hover:bg-white/20 group"
        active-class="bg-white/30 font-semibold shadow-sm"
      >
        <ClockIcon class="w-5 h-5 mr-3 text-white group-hover:rotate-12 transition" />
        Fixed Schedules
      </router-link>

      <router-link
        to="/admin/profile"
        class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ease-in-out hover:bg-white/20 group"
        active-class="bg-white/30 font-semibold shadow-sm"
      >
        <UserIcon class="w-5 h-5 mr-3 text-white group-hover:scale-110 transition" />
        Profile
      </router-link>
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-white/20">
      <button
        @click="logout"
        class="flex items-center w-full px-4 py-3 rounded-xl bg-rose-500 text-white shadow-md transition-all duration-300 ease-in-out hover:bg-rose-600 hover:scale-[1.02] active:scale-95"
      >
        <ArrowRightOnRectangleIcon class="w-5 h-5 mr-3" />
        Logout
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import {
  HomeIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/vue/24/solid";

const router = useRouter();

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};
</script>

<style scoped>
/* Animasi sidebar masuk */
@keyframes slideIn {
  from {
    transform: translateX(-100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
.animate-slideIn {
  animation: slideIn 0.7s ease-out;
}
</style>
