<template>
  <div class="min-h-screen bg-white p-6">
    <div class="max-w-3xl mx-auto">
      <div
        class="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-lg shadow-gray-300/70"
      >
        <h1 class="text-3xl font-bold text-gray-900">Edit Ruangan</h1>
      </div>

      <div
        class="bg-white border border-gray-200 rounded-lg p-6 shadow-md shadow-gray-300/50"
      >
        <form @submit.prevent="updateRoom">
          <div class="mb-4">
            <label class="block font-semibold text-gray-800 mb-1">Nama Ruangan</label>
            <input
              type="text"
              v-model="form.name"
              placeholder="Ruangan 1"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#005f73] focus:outline-none"
              required
            />
          </div>

          <div class="mb-4">
            <label class="block font-semibold text-gray-800 mb-1">Kapasitas</label>
            <input
              type="number"
              v-model="form.capacity"
              placeholder="(7 Orang)"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#005f73] focus:outline-none"
              required
            />
          </div>

          <div class="mb-4">
            <label class="block font-semibold text-gray-800 mb-1">Keterangan</label>
            <input
              type="text"
              v-model="form.description"
              placeholder="Meeting Direksi"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#005f73] focus:outline-none"
            />
          </div>

          <div class="mb-6">
            <label class="block font-semibold text-gray-800 mb-2">Status</label>
            <div class="flex items-center gap-6">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="active"
                  v-model="form.status"
                  class="accent-green-600"
                />
                <span class="text-gray-800">Aktif</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="inactive"
                  v-model="form.status"
                  class="accent-gray-500"
                />
                <span class="text-gray-800">Tidak Aktif</span>
              </label>
            </div>
          </div>

          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="$router.push('/admin/rooms')"
              class="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2.5 bg-[#005f73] hover:bg-[#004c5b] text-white rounded-md font-semibold shadow-sm transition"
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
import Swal from "sweetalert2";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const form = ref({
  name: "",
  capacity: "",
  description: "",
  status: "active",
});

onMounted(async () => {
  try {
    Swal.fire({
      title: "Memuat data ruangan...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const token = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:8000/api/rooms/${route.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data.data || response.data;

    if (!data) {
      Swal.fire("Oops!", "Data ruangan tidak ditemukan ❌", "error");
      router.push("/admin/rooms");
      return;
    }

    form.value = {
      name: data.name || "",
      capacity: data.capacity || "",
      description: data.description || "",
      status: data.status || "active",
    };

    Swal.close();
  } catch (error) {
    console.error("Gagal ambil data ruangan:", error);
    Swal.fire("Error", "Gagal memuat data ruangan ❌", "error").then(() => {
      router.push("/admin/rooms");
    });
  }
});

const updateRoom = async () => {
  try {
    Swal.fire({
      title: "Menyimpan perubahan...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const token = localStorage.getItem("token");
   await axios.put(
  `http://localhost:8000/api/admin/rooms/${route.params.id}`,
  form.value,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);


    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Data ruangan berhasil diperbarui 🎉",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });

    router.push("/admin/rooms");
  } catch (error) {
    console.error("Gagal update ruangan:", error);
    Swal.fire("Gagal", "Tidak dapat memperbarui data ❌", "error");
  } finally {
    Swal.close();
  }
};
</script>
