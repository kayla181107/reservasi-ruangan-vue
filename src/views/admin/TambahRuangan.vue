<template>
  <div class="min-h-screen bg-white p-6">
    <div class="max-w-4xl mx-auto">

      <div class="bg-white border border-gray-200 rounded-md p-6 mb-6 shadow-md">
        <h1 class="text-3xl font-bold text-gray-900">Tambah Ruangan</h1>
      </div>

      <div class="bg-white border border-gray-200 rounded-md p-6 shadow-md">
        <form @submit.prevent="saveRoom">

          <div class="mb-5">
            <label class="block font-semibold mb-2 text-gray-800">Nama Ruangan</label>
            <input
              v-model="room.name"
              type="text"
              placeholder="Nama Ruangan"
              class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              required
            />
          </div>

          <div class="mb-5">
            <label class="block font-semibold mb-2 text-gray-800">Kapasitas</label>
            <input
              v-model="room.capacity"
              type="number"
              placeholder="Kapasitas"
              min="1"
              class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
          </div>

          <div class="mb-5">
            <label class="block font-semibold mb-2 text-gray-800">Deskripsi</label>
            <input
              v-model="room.description"
              type="text"
              placeholder="Deskripsi ruangan"
              class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
          </div>

          <div class="mb-6">
            <label class="block font-semibold mb-2 text-gray-800">Status</label>
            <div class="flex gap-5">
              <label class="flex items-center gap-2">
                <input type="radio" value="active" v-model="room.status" />
                Aktif
              </label>
              <label class="flex items-center gap-2">
                <input type="radio" value="inactive" v-model="room.status" />
                Tidak Aktif
              </label>
            </div>
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
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const room = ref({
  name: "",
  capacity: "",
  description: "",
  status: "active",
});

async function saveRoom() {
  try {
    const token = localStorage.getItem("token");
    await axios.post("http://localhost:8000/api/admin/rooms", room.value, {
      headers: { Authorization: `Bearer ${token}` },
    });
    Swal.fire("Berhasil", "Data ruangan berhasil ditambahkan!", "success");
    router.push("/admin/rooms");
  } catch (e) {
    console.error(e);
    Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan data.", "error");
  }
}

function cancel() {
  router.push("/admin/rooms");
}
</script>
