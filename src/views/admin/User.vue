<template>
  <div class="min-h-screen bg-white p-6">
    <div class="max-w-7xl mx-auto">
      <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-lg shadow-gray-300/70">
        <h1 class="text-3xl font-bold text-gray-900">Data User</h1>
      </div>

      <div class="flex justify-start mb-6">
        <button
          @click="$router.push('/admin/tambah-user')"
          class="bg-[#005f73] hover:bg-[#004c5b] text-white font-semibold px-5 py-2.5 rounded-md shadow-sm transition flex items-center gap-2"
        >
          <UserPlus class="w-5 h-5" />
          <span>Tambah User</span>
        </button>
      </div>

      <div
        v-if="usersData.length"
        class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm"
      >
        <table class="min-w-full text-left border-collapse">
          <thead class="bg-[#005f73] text-white">
            <tr>
              <th class="p-3 font-semibold text-center">No</th>
              <th class="p-3 font-semibold">Nama</th>
              <th class="p-3 font-semibold">Email</th>
              <th class="p-3 font-semibold text-center">Role</th>
              <th class="p-3 font-semibold text-center w-[150px]">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(user, index) in usersData"
              :key="user.id"
              class="border-t hover:bg-gray-50 transition"
            >
              <td class="p-3 text-center">{{ index + 1 }}</td>
              <td class="p-3">{{ user.name }}</td>
              <td class="p-3">{{ user.email }}</td>
              <td class="p-3 text-center">{{ user.role }}</td>
              <td class="p-3 text-center">
                <div class="flex justify-center items-center gap-2">
                  <button
                    @click="$router.push(`/admin/edit-user/${user.id}`)"
                    class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-xs"
                  >
                    Edit
                  </button>
                  <button
                    @click="remove(user.id)"
                    class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-xs"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-else-if="!loading"
        class="bg-white rounded-2xl shadow-lg p-10 text-center text-gray-500 border border-gray-200"
      >
        <p class="text-lg font-medium">Belum ada user ditemukan</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import { UserPlus } from "lucide-vue-next";

const usersData = ref([]);
const loading = ref(false);

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

async function fetchUsers() {
  loading.value = true;
  try {
    Swal.showLoading();
    const response = await api.get("/api/admin/users", { params: { per_page: 9999 } });
    const data = Array.isArray(response.data?.data) ? response.data.data : [];
    usersData.value = data.map((u) => ({
      id: u.id,
      name: u.name || u.username || "Tidak Ada Nama",
      email: u.email || "-",
      role:
        u.role ||
        (Array.isArray(u.roles) && u.roles.length > 0 ? u.roles[0] : "Tidak Ada Role"),
    }));
    Swal.close();
  } catch (e) {
    Swal.fire("Gagal", "Gagal memuat data user ❌", "error");
  } finally {
    loading.value = false;
  }
}

async function remove(id) {
  const confirm = await Swal.fire({
    title: "Hapus User?",
    text: "Data user akan dihapus permanen!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, Hapus",
    cancelButtonText: "Batal",
    confirmButtonColor: "#d33",
  });

  if (confirm.isConfirmed) {
    try {
      Swal.showLoading();
      await api.delete(`/api/admin/users/${id}`);
      Swal.close();

      await Swal.fire({
        title: "Data User tersebut telah berhasil dihapus.",
        icon: "success",
        confirmButtonText: "Oke",
        confirmButtonColor: "#005f73",
        allowOutsideClick: false,
      });

      fetchUsers();
    } catch (e) {
      Swal.close();
      Swal.fire("Error", "Gagal menghapus user ❌", "error");
    }
  }
}

onMounted(fetchUsers);
</script>
