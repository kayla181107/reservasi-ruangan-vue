<template>
  <div
    class="w-50 h-[calc(100vh-72px)] flex flex-col shadow-lg border-r border-gray-200 bg-[#0B5C75] text-white transition-all duration-500 ease-in-out"
  >
    <nav class="flex-1 p-4 space-y-1 overflow-y-auto">

      <router-link
        to="/admin"
        class="flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-[#09495E]"
        active-class="bg-[#09495E] font-semibold"
      >
        <LayoutDashboard class="w-5 h-5 mr-3 text-white" />
        Dashboard
      </router-link>

      <router-link
        to="/admin/reservations"
        class="flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-[#09495E]"
        active-class="bg-[#09495E] font-semibold"
      >
        <FileText class="w-5 h-5 mr-3 text-white"/>
        Reservasi
      </router-link>

      <router-link
        to="/admin/rooms"
        class="flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-[#09495E]"
        active-class="bg-[#09495E] font-semibold"
      >
      <DoorOpen class="w-5 h-5 mr-3 text-white" />
        Ruangan
      </router-link>

      <router-link
        to="/admin/users"
        class="flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-[#09495E]"
        active-class="bg-[#09495E] font-semibold"
      >
        <User class="w-5 h-5 mr-3 text-white"/>
        User
      </router-link>

      <router-link
        to="/admin/fixed-schedules"
        class="flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-[#09495E]"
        active-class="bg-[#09495E] font-semibold"
      >
        <CalendarRange class="w-5 h-5 mr-3 text-white" />
        Jadwal Tetap
      </router-link>
    </nav>

    <!-- Tombol Logout -->
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
  BuildingOfficeIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/vue/24/solid";
import { LayoutDashboard } from "lucide-vue-next"; 
import { FileText } from 'lucide-vue-next';
import { DoorOpen } from 'lucide-vue-next';
import { User } from 'lucide-vue-next';
import { CalendarRange } from 'lucide-vue-next';

const router = useRouter();

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};
</script>
