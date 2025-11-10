<template>
  <div class="min-h-screen bg-white p-6">
    <div class="max-w-7xl mx-auto">

       <div
        class="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-lg shadow-gray-300/70"
      >
        <h1 class="text-3xl font-bold text-gray-900">Data Ruangan</h1>
      </div>

      <div class="flex justify-start mb-6">
        <button
          @click="$router.push('/admin/tambah-ruangan')"
          class="bg-[#005f73] hover:bg-[#004c5b] text-white font-semibold px-5 py-2.5 rounded-md shadow-sm transition flex items-center gap-2"
        >
          <HousePlus class="w-5 h-5" />
          <span>Tambah Ruangan</span>
        </button>
      </div>

      <div
        v-if="roomsData.length"
        class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm"
      >
        <table class="min-w-full text-left border-collapse">
          <thead class="bg-[#005f73] text-white">
            <tr>
              <th class="p-3 font-semibold text-center">No</th>
              <th class="p-3 font-semibold">Nama Ruangan</th>
              <th class="p-3 font-semibold text-center">Kapasitas</th>
              <th class="p-3 font-semibold">Deskripsi</th>
              <th class="p-3 font-semibold text-center">Status</th>
              <th class="p-3 font-semibold text-center w-[150px]">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(room, index) in roomsData"
              :key="room.id"
              class="border-t hover:bg-gray-50 transition"
            >
              <td class="p-3 text-center">{{ index + 1 }}</td>
              <td class="p-3">{{ room.name }}</td>
              <td class="p-3 text-center">{{ room.capacity }}</td>
              <td class="p-3">{{ room.description || '-' }}</td>

              <td class="p-3 text-center">
                <span
                  :class="room.status === 'active'
                    ? 'bg-[#E0F2F1] text-[#00695C] border border-[#B2DFDB] px-3 py-1 rounded-full text-xs font-semibold'
                    : 'bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2] px-3 py-1 rounded-full text-xs font-semibold'"
                >
                  {{ room.status === 'active' ? 'Aktif' : 'Tidak Aktif' }}
                </span>
              </td>

              <td class="p-3 text-center">
                <div class="flex justify-center items-center gap-2">
                  <button
                    @click="$router.push(`/admin/edit-ruangan/${room.id}`)"
                    class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-xs"
                    >
                    Edit
                  </button>

                  <button
                    @click="remove(room.id)"
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
        <p class="text-lg font-medium">Belum ada ruangan ditemukan</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import { rooms } from "@/api/rooms";
import { HousePlus } from "lucide-vue-next";

const roomsData = ref([]);
const loading = ref(false);

async function fetchRooms() {
  try {
    Swal.showLoading();
    const { data } = await rooms.all({ per_page: 9999 });
    roomsData.value = Array.isArray(data) ? data : data.data;
    Swal.close();
  } catch (e) {
    Swal.fire("Gagal", "Gagal memuat data ruangan ❌", "error");
  } finally {
    loading.value = false;
  }
}

async function remove(id) {
  const room = roomsData.value.find(r => r.id === id);

  if (room && room.status === 'active') {
    Swal.fire({
      title: "Tidak dapat dihapus!",
      text: "Ruangan ini sedang aktif atau sudah dibooking, sehingga tidak dapat dihapus.",
      icon: "warning",
      confirmButtonText: "Oke",
      confirmButtonColor: "#005f73",
    });
    return;
  }

  const confirm = await Swal.fire({
    title: "Hapus Ruangan?",
    text: "Data ruangan akan dihapus permanen!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, Hapus",
    cancelButtonText: "Batal",
    confirmButtonColor: "#d33",
  });

  if (confirm.isConfirmed) {
    try {
      Swal.showLoading();
      await rooms.destroy(id);
      Swal.fire("Berhasil", "Ruangan berhasil dihapus ✅", "success");
      fetchRooms();
    } catch (e) {
      Swal.fire("Error", "Gagal menghapus ruangan ❌", "error");
    } finally {
      Swal.close();
    }
  }
}

onMounted(fetchRooms);
</script>
  