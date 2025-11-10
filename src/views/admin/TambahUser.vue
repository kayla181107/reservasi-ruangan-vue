<template>
  <div class="min-h-screen bg-white p-6">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white border border-gray-200 rounded-md p-6 mb-6 shadow-md">
        <h1 class="text-3xl font-bold text-gray-900">Tambah User</h1>
      </div>

      <div class="bg-white border border-gray-200 rounded-md p-6 shadow-md">
        <form @submit.prevent="saveUser">
          
          <div class="mb-5">
            <label class="block font-semibold mb-2 text-gray-800">Nama</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Nama Lengkap"
              class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              required
            />
          </div>

          <div class="mb-5">
            <label class="block font-semibold mb-2 text-gray-800">Email</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="Email"
              class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              required
            />
          </div>

          <div class="mb-5">
            <label class="block font-semibold mb-2 text-gray-800">Password</label>
            <input
              v-model="form.password"
              type="password"
              placeholder="Password"
              class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              required
            />
          </div>

          <div class="mb-5">
            <label class="block font-semibold mb-2 text-gray-800">Role</label>
            <select
              v-model="form.role"
              class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              required
            >
              <option value="" disabled>Pilih Role</option>
              <option v-for="r in roles" :key="r.id" :value="r.name">
                {{ r.name }}
              </option>
            </select>

            <p v-if="roles.length === 0" class="text-sm text-red-500 mt-2">
              Tidak ada role ditemukan.
            </p>
            <p v-else class="text-sm text-gray-500 mt-2">
              Role ditemukan: {{ roles.length }}
            </p>
          </div>

          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="cancel"
              class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-[#005f73] text-white rounded-lg hover:bg-[#004c5b] transition"
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
import axios from "axios";
import Swal from "sweetalert2";
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const form = reactive({
  name: "",
  email: "",
  password: "",
  role: "",
});

const roles = ref([]);


async function fetchRoles() {
  try {
    const res = await axios.get("http://localhost:8000/api/admin/roles");

    console.log("Response roles:", res.data); // Debug

    if (res.data && Array.isArray(res.data.data)) {
      roles.value = res.data.data;
    } else {
      roles.value = [];
    }

  } catch (error) {
    console.error("Gagal mengambil role:", error.response?.data || error.message);
    Swal.fire("Gagal", "Tidak dapat mengambil daftar role.", "error");
  }
}


async function saveUser() {
  try {
    const token = localStorage.getItem("token");
    await axios.post("http://localhost:8000/api/admin/users", form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    Swal.fire("Berhasil", "User berhasil ditambahkan!", "success");
    router.push("/admin/users");
  } catch (error) {
    console.error("Gagal menyimpan user:", error);
    Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan data.", "error");
  }
}

function cancel() {
  router.push("/admin/users");
}

onMounted(fetchRoles);
</script>
