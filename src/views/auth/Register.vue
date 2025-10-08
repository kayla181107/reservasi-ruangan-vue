<template>
  <div class="flex items-center justify-center min-h-screen relative overflow-hidden px-4 md:px-8 py-12 md:py-16">
    <!-- Background gradasi animasi -->
    <div class="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 animate-bgMove"></div>

    <!-- Card Register -->
    <div
      class="relative w-full max-w-3xl bg-white/95 backdrop-blur-xl p-8 md:p-12 rounded-2xl shadow-2xl border border-white/30 animate-fadeIn z-10"
    >
      <!-- Icon -->
      <div class="flex justify-center mb-6">
        <div
          class="w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg animate-bounce-slow"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-10 h-10 md:w-12 md:h-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2v-7H3v7a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      <!-- Judul -->
      <h1 class="text-3xl md:text-4xl font-extrabold text-center text-blue-800 mb-2">
        Reservasi Ruangan
      </h1>
      <p class="text-2xl md:text-3xl font-semibold text-center text-yellow-400 mb-6">
        Register
      </p>

      <!-- Form -->
      <form @submit.prevent="onRegister" class="space-y-4">
        <!-- Nama -->
        <div class="group">
          <label class="block text-sm md:text-base font-medium mb-1 text-blue-800">Nama</label>
          <input
            v-model="name"
            type="text"
            placeholder="Masukkan nama"
            class="w-full border border-white/30 bg-white/80 text-blue-900 rounded-xl px-4 py-2 md:px-5 md:py-3 focus:ring-2 focus:ring-blue-400 focus:border-yellow-400 focus:outline-none placeholder-blue-300 transition"
            required
          />
        </div>

        <!-- Email -->
        <div class="group">
          <label class="block text-sm md:text-base font-medium mb-1 text-blue-800">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="Masukkan email"
            class="w-full border border-white/30 bg-white/80 text-blue-900 rounded-xl px-4 py-2 md:px-5 md:py-3 focus:ring-2 focus:ring-blue-400 focus:border-yellow-400 focus:outline-none placeholder-blue-300 transition"
            required
          />
        </div>

        <!-- Password -->
        <div class="group">
          <label class="block text-sm md:text-base font-medium mb-1 text-blue-800">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Masukkan password"
            class="w-full border border-white/30 bg-white/80 text-blue-900 rounded-xl px-4 py-2 md:px-5 md:py-3 focus:ring-2 focus:ring-blue-400 focus:border-yellow-400 focus:outline-none placeholder-blue-300 transition"
            required
          />
        </div>

        <!-- Konfirmasi Password -->
        <div class="group">
          <label class="block text-sm md:text-base font-medium mb-1 text-blue-800">Konfirmasi Password</label>
          <input
            v-model="passwordConfirmation"
            type="password"
            placeholder="Ulangi password"
            class="w-full border border-white/30 bg-white/80 text-blue-900 rounded-xl px-4 py-2 md:px-5 md:py-3 focus:ring-2 focus:ring-blue-400 focus:border-yellow-400 focus:outline-none placeholder-blue-300 transition"
            required
          />
        </div>

        <!-- Error -->
        <p
          v-if="errorMessage"
          class="text-red-500 text-sm md:text-base text-center font-medium animate-shake"
        >
          {{ errorMessage }}
        </p>

        <!-- Button -->
        <button
          type="submit"
          class="w-full bg-gradient-to-r from-blue-500 via-purple-400 to-yellow-400 text-white py-3 md:py-3.5 rounded-xl font-semibold shadow-lg hover:opacity-90 hover:scale-[1.02] transition-all duration-300 glow-button"
        >
          Register
        </button>
      </form>

      <!-- Login Link -->
      <p class="text-sm md:text-base text-center mt-6 text-blue-800">
        Sudah punya akun?
        <router-link
          to="/login"
          class="text-yellow-400 font-medium hover:underline hover:text-purple-400"
        >
          Login disini
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import api from "@/api/axios"

const name = ref("")
const email = ref("")
const password = ref("")
const passwordConfirmation = ref("")
const errorMessage = ref("")
const router = useRouter()

const onRegister = async () => {
  errorMessage.value = ""

  try {
    if (password.value !== passwordConfirmation.value) {
      errorMessage.value = "Password dan konfirmasi password tidak sama!"
      return
    }

    await api.post("/register", {
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    })

    router.push("/login")
  } catch (err) {
    errorMessage.value = err.response?.data?.message || "Registrasi gagal!"
  }
}
</script>

<style scoped>
/* Fade In Card */
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-fadeIn { animation: fadeIn 1s ease-in-out; }

/* Bounce Icon */
@keyframes bounceSlow { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-6px);} }
.animate-bounce-slow { animation: bounceSlow 3s infinite; }

/* Shake Error */
@keyframes shake { 0%,100%{transform:translateX(0);} 20%{transform:translateX(-5px);} 40%{transform:translateX(5px);} 60%{transform:translateX(-5px);} 80%{transform:translateX(5px);} }
.animate-shake { animation: shake 0.4s ease-in-out; }

/* Glow Button */
.glow-button { box-shadow: 0 0 8px rgba(255,255,0,0.6), 0 0 15px rgba(128,0,255,0.4); }
.glow-button:hover { box-shadow: 0 0 12px rgba(255,255,0,0.8), 0 0 20px rgba(128,0,255,0.6); }

/* Background Horizontal Move Animation */
@keyframes bgMove { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
.animate-bgMove { background-size: 200% 200%; animation: bgMove 15s linear infinite; }
</style>
