<template>
  <div class="min-h-screen flex flex-col bg-gray-100 overflow-x-hidden">
    <Navbar class="z-50" @toggleSidebar="toggleSidebar" />

    <div class="flex flex-1 relative overflow-y-auto">

      <transition name="smooth-slide">
        <Sidebar
          v-if="isSidebarOpen"
          class="fixed top-[98px] left-0 h-[calc(100vh-98px)] w-[230px] bg-[#0B5C75] text-white shadow-xl border-r border-[#0B5C75]/50 z-40 rounded-r-2xl"
          :is-open="isSidebarOpen"
        />
      </transition>

      <main
        class="flex-1 overflow-y-auto p-6 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
        :class="isSidebarOpen ? 'ml-[250px]' : 'ml-0'"
      >
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref } from "vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import Footer from "@/components/Footer.vue";

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>

<style scoped>
main {
  background-color: #f9fafb;
  min-height: 100vh;
}

.smooth-slide-enter-active {
  transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}
.smooth-slide-leave-active {
  transition: all 0.45s cubic-bezier(0.25, 1, 0.5, 1);
}
.smooth-slide-enter-from {
  transform: translateX(-60px);
  opacity: 0;
  filter: blur(4px);
}
.smooth-slide-enter-to {
  transform: translateX(0);
  opacity: 1;
  filter: blur(0);
}
.smooth-slide-leave-from {
  transform: translateX(0);
  opacity: 1;
  filter: blur(0);
}
.smooth-slide-leave-to {
  transform: translateX(-40px);
  opacity: 0;
  filter: blur(3px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
