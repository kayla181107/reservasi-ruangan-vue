<template>
  <div
    class="w-64 bg-gradient-to-b from-emerald-50 via-green-50 to-blue-50 text-gray-700 h-screen flex flex-col shadow-xl border-r border-gray-200 animate-slideIn"
  >
    <!-- Logo -->
    <div class="p-6 border-b border-gray-200">
      <h2 class="text-2xl font-extrabold text-emerald-600">Admin Panel</h2>
      <p class="text-sm text-gray-500">Reservation System</p>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-4 space-y-2">
      <router-link
        to="/admin"
        class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ease-in-out hover:bg-emerald-100 hover:text-emerald-700 group"
        active-class="bg-emerald-200 text-emerald-800 font-semibold shadow-sm"
      >
        <HomeIcon class="w-5 h-5 mr-3 text-emerald-500 group-hover:scale-110 transition" />
        Dashboard
      </router-link>

      <router-link
        to="/admin/rooms"
        class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ease-in-out hover:bg-blue-100 hover:text-blue-700 group"
        active-class="bg-blue-200 text-blue-800 font-semibold shadow-sm"
      >
        <BuildingOfficeIcon class="w-5 h-5 mr-3 text-blue-500 group-hover:scale-110 transition" />
        Rooms
      </router-link>

      <router-link
        to="/admin/reservations"
        class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ease-in-out hover:bg-indigo-100 hover:text-indigo-700 group"
        active-class="bg-indigo-200 text-indigo-800 font-semibold shadow-sm"
      >
        <CalendarDaysIcon class="w-5 h-5 mr-3 text-indigo-500 group-hover:rotate-12 transition" />
        Reservations
      </router-link>

      <router-link
        to="/admin/fixed-schedules"
        class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ease-in-out hover:bg-purple-100 hover:text-purple-700 group"
        active-class="bg-purple-200 text-purple-800 font-semibold shadow-sm"
      >
        <ClockIcon class="w-5 h-5 mr-3 text-purple-500 group-hover:rotate-12 transition" />
        Fixed Schedules
      </router-link>

      <router-link
        to="/admin/profile"
        class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ease-in-out hover:bg-pink-100 hover:text-pink-700 group"
        active-class="bg-pink-200 text-pink-800 font-semibold shadow-sm"
      >
        <UserIcon class="w-5 h-5 mr-3 text-pink-500 group-hover:scale-110 transition" />
        Profile
      </router-link>
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-gray-200">
      <button
        @click="logout"
        class="flex items-center w-full px-4 py-3 rounded-xl bg-red-500 text-white shadow-md transition-all duration-300 ease-in-out hover:bg-red-600 hover:scale-[1.02] active:scale-95"
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
