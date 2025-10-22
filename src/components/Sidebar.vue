<template>
  <div
    class="w-65 h-screen flex flex-col shadow-lg border-r border-gray-200 bg-[#0B5C75] text-white transition-all duration-500 ease-in-out"
  >
    

    <!-- Navigation -->
    <nav class="flex-1 p-4 space-y-1">
      <router-link
        to="/admin"
        class="flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-[#09495E] group"
        active-class="bg-[#09495E] font-semibold"
      >
        <HomeIcon class="w-5 h-5 mr-3 text-white" />
        Dashboard
      </router-link>

      <router-link
        to="/admin/reservations"
        class="flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-[#09495E] group"
        active-class="bg-[#09495E] font-semibold"
      >
        <CalendarDaysIcon class="w-5 h-5 mr-3 text-white" />
        Reservasi
      </router-link>

      <router-link
        to="/admin/rooms"
        class="flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-[#09495E] group"
        active-class="bg-[#09495E] font-semibold"
      >
        <BuildingOfficeIcon class="w-5 h-5 mr-3 text-white" />
        Ruangan
      </router-link>

      <router-link
        to="/admin/users"
        class="flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-[#09495E] group"
        active-class="bg-[#09495E] font-semibold"
      >
        <UserIcon class="w-5 h-5 mr-3 text-white" />
        User
      </router-link>

      <router-link
        to="/admin/fixed-schedules"
        class="flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-[#09495E] group"
        active-class="bg-[#09495E] font-semibold"
      >
        <ClockIcon class="w-5 h-5 mr-3 text-white" />
        Jadwal Tetap
      </router-link>
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-white/20">
      <button
        @click="logout"
        class="flex items-center w-full px-4 py-3 rounded-lg bg-rose-500 text-white shadow-md hover:bg-rose-600 transition-all duration-300"
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
