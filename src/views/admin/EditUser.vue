<template>
  <div class="min-h-screen bg-white p-6">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div
        class="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-lg shadow-gray-300/70"
      >
        <h1 class="text-3xl font-bold text-gray-900">Edit User</h1>
      </div>

      <!-- Form -->
      <div
        class="bg-white rounded-lg border border-gray-200 p-6 shadow-md shadow-gray-300/50"
      >
        <form @submit.prevent="updateUser">
          <!-- Nama -->
          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-2">Nama</label>
            <input
              v-model="form.nama"
              type="text"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-teal-300"
              placeholder="Masukkan nama"
              required
            />
          </div>

          <!-- Email -->
          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-2">Email</label>
            <input
              v-model="form.email"
              type="email"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-teal-300"
              placeholder="Masukkan email"
              required
            />
          </div>

          <!-- Password -->
          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-2">Password</label>
            <input
              v-model="form.password"
              type="password"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-teal-300"
              placeholder="Masukkan password baru (opsional)"
            />
            <p class="text-sm text-gray-500 mt-1">
              Kosongkan jika tidak ingin mengganti password
            </p>
          </div>

          <!-- Role -->
          <div class="mb-6">
            <label class="block text-gray-700 font-medium mb-2">Role</label>
            <select
              v-model="form.role"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-teal-300"
              required
            >
              <option disabled value="">Pilih Role</option>
              <option
                v-for="role in roles"
                :key="role.id"
                :value="role.name"
              >
                {{ role.name.charAt(0).toUpperCase() + role.name.slice(1) }}
              </option>

              <option v-if="roles.length === 0" disabled>
                Tidak ada role tersedia
              </option>
            </select>
          </div>

          <!-- Tombol -->
          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="$router.back()"
              class="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-md font-semibold shadow-sm transition"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import axios from "axios";

const route = useRoute();
const router = useRouter();

const form = ref({
  nama: "",
  email: "",
  password: "",
  role: "",
});

const roles = ref([]);

// === Axios instance ===
const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// === Lifecycle ===
onMounted(async () => {
  await loadRoles();
  await loadUser();
});

// === Load daftar role ===
const loadRoles = async () => {
  try {
    const res = await api.get("/api/admin/roles");
    roles.value = res.data.data || res.data;
  } catch (error) {
    console.error("Gagal memuat role:", error);
    Swal.fire("Error", "Gagal memuat role ❌", "error");
  }
};

// === Load data user ===
const loadUser = async () => {
  try {
    Swal.fire({
      title: "Memuat data user...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const response = await api.get(`/api/admin/users/${route.params.id}`);
    const data = response.data.data || response.data;

    if (!data) {
      Swal.fire("Oops!", "Data user tidak ditemukan ❌", "error");
      router.push("/admin/users");
      return;
    }

    form.value = {
      nama: data.name || "",
      email: data.email || "",
      password: "",
      role: data.roles?.[0]?.name || "",
    };

    Swal.close();
  } catch (error) {
    console.error("Gagal memuat user:", error);
    Swal.fire("Error", "Gagal memuat data user ❌", "error").then(() => {
      router.push("/admin/users");
    });
  }
};

   const updateUser = async () => {
  try {
    if (!form.value.role) {
      Swal.fire("Peringatan", "Silakan pilih role terlebih dahulu ⚠️", "warning");
      return;
    }

    Swal.fire({
      title: "Menyimpan perubahan...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const payload = {
      name: form.value.nama,
      email: form.value.email,
      role: form.value.role,
    };

    if (form.value.password) {
      payload.password = form.value.password;
    }

    await api.put(`/api/admin/users/${route.params.id}`, payload);

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Data user berhasil diperbarui 🎉",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });

    router.push("/admin/users");
  } catch (error) {
    console.error("Gagal update user:", error);
    let msg = "Tidak dapat memperbarui data ❌";
    if (error.response?.data?.errors) {
      const firstError = Object.values(error.response.data.errors)[0];
      msg = Array.isArray(firstError) ? firstError[0] : firstError;
    } else if (error.response?.data?.message) {
      msg = error.response.data.message;
    }
    Swal.fire("Gagal", msg, "error");
  } finally {
    Swal.close();
  }
};
</script>
