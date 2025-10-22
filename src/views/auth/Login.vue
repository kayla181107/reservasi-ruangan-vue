<template>
  <div class="min-h-screen flex justify-center items-center bg-white-100 py-10">
    <div
      class="bg-white w-[1100px] h-auto flex rounded-3xl shadow-xl overflow-hidden border border-gray-200"
    >
      <!-- Bagian kiri: Form -->
      <div
        class="w-full md:w-1/2 flex flex-col justify-center items-center px-12 py-12"
      >
        <div class="w-full max-w-sm">
          <!-- Judul -->
          <h2 class="text-2xl font-bold text-gray-800 text-center mb-2">
            Login
          </h2>
          <p class="text-sm text-gray-500 text-center mb-8">
            Masuk untuk memesan ruang pertemuan
          </p>

          <!-- Form -->
          <form @submit.prevent="onLogin" class="space-y-6">
            <!-- Username -->
            <div>
              <label
                class="block text-sm font-semibold text-gray-800 mb-1"
                for="username"
              >
                Username
              </label>
              <input
                id="username"
                v-model="email"
                type="text"
                placeholder="Username"
                class="w-full border border-sky-600 rounded-md px-3 py-2 text-gray-800 focus:ring-2 focus:ring-sky-600 focus:outline-none transition"
                required
              />
            </div>

            <!-- Password -->
            <div>
              <div class="flex justify-between items-center mb-1">
                <label class="block text-sm font-semibold text-gray-800"
                  >Password</label
                >
                <a href="#" class="text-xs text-black hover:underline"
                  >Forgot your password?</a
                >
              </div>
              <input
                v-model="password"
                type="password"
                placeholder="Password"
                class="w-full border border-sky-600 rounded-md px-3 py-2 text-gray-800 focus:ring-2 focus:ring-sky-600 focus:outline-none transition"
                required
              />
            </div>

            <!-- Pesan Error -->
            <p
              v-if="errorMessage"
              class="text-red-500 text-sm text-center font-medium"
            >
              {{ errorMessage }}
            </p>

            <!-- Tombol Login -->
            <button
              type="submit"
              class="w-full bg-sky-800 hover:bg-sky-700 text-white font-semibold py-2 rounded-md transition-all duration-300"
            >
              Login
            </button>

          

            <!-- Tombol Sosial -->
            <div class="flex space-x-3">
              <button
                type="button"
                class="flex-1 border border-gray-300 rounded-md py-2 text-sm flex justify-center items-center hover:bg-gray-50 transition"
              >
                <img
                  src="/images/google.jpg"
                  class="w-5 h-5 mr-2"
                  alt="Google"
                />
                Login with Google
              </button>

              <button
                type="button"
                class="flex-1 border border-gray-300 rounded-md py-2 text-sm flex justify-center items-center hover:bg-gray-50 transition"
              >
                <img
                  src="/images/apple.jpg"
                  class="w-5 h-5 mr-2"
                  alt="Apple"
                />
                Login with Apple
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Bagian kanan: Gambar -->
      <div class="hidden md:flex w-1/2 items-center justify-center p-10">
        <img
          src="/images/ruangan.jpg"
          alt="Meeting Room"
          class="rounded-3xl w-full h-[550px] object-cover object-[35%]"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/api/axios";

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();

const onLogin = async () => {
  errorMessage.value = "";
  try {
    const res = await api.post("/login", {
      email: email.value,
      password: password.value,
    });

    const token = res.data?.data?.token;
    if (token) {
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      router.push("/admin");
    } else {
      errorMessage.value = "Token tidak ditemukan di respons API!";
    }
  } catch (err) {
    errorMessage.value =
      err.response?.data?.message ||
      "Login gagal. Periksa email dan password!";
  }
};
</script>

<style scoped>
body {
  font-family: "Inter", sans-serif;
}

/* Efek hover */
button {
  transition: all 0.3s ease;
}

/* Animasi fade in */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

div {
  animation: fadeIn 0.6s ease-out;
}
</style>
