<template>
  <div class="min-h-screen bg-white p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-lg shadow-gray-300/70">
        <h1 class="text-3xl font-bold text-gray-900">Daftar Reservasi</h1>
      </div>

      <!-- Filter -->
      <div class="flex flex-wrap items-center gap-3 mb-6">
        <div class="relative">
          <select
            v-model="selectedRoom"
            class="bg-[#005f73] text-white px-4 py-2 rounded-md font-medium shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none"
          >
            <option value="">Ruangan</option>
            <option v-for="room in roomOptions" :key="room.id" :value="room.id">
              {{ room.nama_ruangan || room.name || room.room_name || `Ruangan #${room.id}` }}
            </option>
          </select>
        </div>

        <div class="relative">
          <select
            v-model="selectedStatus"
            class="bg-[#005f73] text-white px-4 py-2 rounded-md font-medium shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none"
          >
            <option value="">Status</option>
            <option value="approved">Disetujui</option>
            <option value="pending">Menunggu</option>
            <option value="rejected">Ditolak</option>
          </select>
        </div>

        <div class="relative">
          <input
            type="date"
            v-model="selectedDate"
            class="bg-[#005f73] text-white px-4 py-2 rounded-md font-medium shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
        </div>

        <button
          @click="exportReport"
          class="bg-[#005f73] text-white px-4 py-2 rounded-md font-medium shadow-sm hover:bg-[#004c5b] transition"
        >
          Export laporan (CSV/Excel)
        </button>
      </div>

      <!-- Table -->
      <div
        v-if="filteredReservations.length"
        class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm"
      >
        <table class="min-w-full text-left border-collapse">
          <thead class="bg-[#005f73] text-white">
            <tr>
              <th class="p-3 font-semibold">Tanggal</th>
              <th class="p-3 font-semibold">Ruangan</th>
              <th class="p-3 font-semibold">Jam</th>
              <th class="p-3 font-semibold">Status</th>
              <th class="p-3 font-semibold text-center w-[180px]">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="r in filteredReservations"
              :key="r.id"
              class="border-t hover:bg-gray-50 transition"
            >
              <td class="p-3 text-gray-700">{{ r.date }}</td>
              <td class="p-3 text-gray-700">{{ r.room?.name || r.room?.nama_ruangan || '-' }}</td>
              <td class="p-3 text-gray-700">
                {{ r.start_time }} - {{ r.end_time || r.start_time }}
              </td>
              <td class="p-3">
                <span
                  :class="{
                    'bg-green-600': r.status === 'approved',
                    'bg-red-600': r.status === 'rejected',
                    'bg-gray-400': r.status === 'pending',
                  }"
                  class="text-white text-xs px-3 py-1 rounded-full"
                >
                  {{ getStatusLabel(r.status) }} 
                </span>
              </td>

              <td class="p-3 text-center relative">
                <div class="flex justify-center items-center gap-2">
                  <template v-if="r.status === 'pending'">
                    <button
                      @click="openModal(r.id, 'approved', r.date)"
                      class="bg-green-600 text-white px-3 py-1 rounded-full hover:bg-green-700 transition"
                    >
                      Setujui
                    </button>

                    <button
                      @click="openModal(r.id, 'rejected', r.date)"
                      class="bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 transition"
                    >
                      Tolak
                    </button>
                  </template>

                  <template v-else>
                    <div class="relative">
                      <button
                        @click="toggleDropdown(r.id)"
                        class="bg-gray-500 text-white px-3 py-1 rounded-full hover:bg-gray-600 transition"
                      >
                        Ubah Status
                      </button>

                       <transition name="fade">
                        <div
                          v-if="openDropdown === r.id"
                          class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-20"
                        >
                          <button
                            v-for="option in statusOptions"
                            :key="option.value"
                            @click="confirmChangeStatus(r, option.value)"
                            class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition"
                          >
                            {{ option.label }}
                          </button>
                        </div>
                      </transition>
                    </div>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty -->
      <div
        v-else
        class="bg-white rounded-2xl shadow-lg p-10 text-center text-gray-500 border border-gray-200"
      >
        <p class="text-lg font-medium">Belum ada reservasi ditemukan</p>
      </div>

      <!-- Modal -->
      <transition name="fade">
        <div
          v-if="modal.open"
          class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 class="text-xl font-bold mb-3 text-gray-800">
              {{
                modal.status === "approved"
                  ? "Setujui Reservasi"
                  : modal.status === "rejected"
                  ? "Tolak Reservasi"
                  : "Ubah Status Reservasi"
              }}
            </h3>

            <p class="text-sm text-gray-500 mb-4">
              {{
                modal.status === "approved"
                  ? "Tambahkan catatan jika diperlukan (opsional)."
                  : modal.status === "rejected"
                  ? "Tulis alasan penolakan secara singkat."
                  : "Pilih status baru untuk reservasi ini."
              }}
            </p>

            <template v-if="modal.status === 'change'">
              <select
                v-model="modal.newStatus"
                class="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
              >
                <option disabled value="">Pilih Status Baru</option>
                <option value="approved">Disetujui</option>
                <option value="pending">Menunggu</option>
                <option value="rejected">Ditolak</option>
              </select>
            </template>

            <textarea
              v-model="modal.reason"
              rows="3"
              class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-200 focus:outline-none mb-4"
              :placeholder="
                modal.status === 'approved'
                  ? 'Opsional...'
                  : modal.status === 'rejected'
                  ? 'Tulis alasan penolakan...'
                  : 'Tambahkan catatan jika perlu...'
              "
            ></textarea>

            <div class="flex justify-end gap-3">
              <button
                @click="closeModal"
                class="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              >
                Batal
              </button>
              <button
                @click="submitModal"
                class="px-4 py-2 rounded-lg text-white font-semibold transition"
                :class="
                  modal.status === 'approved'
                    ? 'bg-green-600 hover:bg-green-700'
                    : modal.status === 'rejected'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-gray-600 hover:bg-gray-700'
                "
              >
                {{
                  modal.status === "approved"
                    ? "Setujui"
                    : modal.status === "rejected"
                    ? "Tolak"
                    : "Simpan Perubahan"
                }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { reservations } from "@/api/reservations";
import axios from "axios";
import { ref, computed, onMounted } from "vue";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";

const reservationsList = ref([]);
const roomOptions = ref([]);
const selectedRoom = ref("");
const selectedStatus = ref("");
const selectedDate = ref("");
const openDropdown = ref(null);
const modal = ref({
  open: false,
  id: null,
  status: null,
  reason: "",
  newStatus: "",
  date: "",
});

const statusOptions = [
  { value: "approved", label: "Disetujui" },
  { value: "pending", label: "Menunggu" },
  { value: "rejected", label: "Ditolak" },
];

function getStatusLabel(status) {
  if (status === "approved") return "Disetujui";
  if (status === "rejected") return "Ditolak";
  return "Menunggu";
}

async function fetchData() {
  try {
    Swal.showLoading();
    const token = localStorage.getItem("token");
    const res = await reservations.all({ per_page: 9999 });
    reservationsList.value = res.data?.data ?? res.data;

    const roomRes = await axios.get("http://localhost:8000/api/rooms", {
      params: { per_page: 9999 },
      headers: { Authorization: `Bearer ${token}` },
    });

    roomOptions.value = roomRes.data?.data ?? [];
    Swal.close();
  } catch (e) {
    console.error("Error ambil data:", e);
    Swal.fire("Gagal", "Gagal mengambil data reservasi atau ruangan.", "error");
  }
}

const filteredReservations = computed(() =>
  reservationsList.value.filter((r) => {
    const matchRoom = selectedRoom.value ? r.room?.id === selectedRoom.value : true;
    const matchStatus = selectedStatus.value ? r.status === selectedStatus.value : true;
    const matchDate = selectedDate.value ? r.date === selectedDate.value : true;
    return matchRoom && matchStatus && matchDate;
  })
);

async function exportReport() {
  if (!filteredReservations.value.length) {
    Swal.fire("Info", "Tidak ada data untuk diekspor!", "info");
    return;
  }

  Swal.fire({
    title: "Memproses...",
    text: "Mempersiapkan laporan untuk diunduh.",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  const exportData = filteredReservations.value.map((r) => ({
    Tanggal: r.date,
    Ruangan: r.room?.name || r.room?.nama_ruangan || "-",
    Jam: `${r.start_time} - ${r.end_time || r.start_time}`,
    Status: getStatusLabel(r.status),
    Catatan: r.reason || "-",
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Reservasi");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const fileName = `Laporan_Reservasi_${new Date().toISOString().slice(0, 10)}.xlsx`;
  saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), fileName);

  Swal.fire("Berhasil", "Laporan berhasil diekspor!", "success");
}

// Dropdown
function toggleDropdown(id) {
  openDropdown.value = openDropdown.value === id ? null : id;
}

function openModal(id, status, date) {
  modal.value = { open: true, id, status, reason: "", newStatus: "", date };
}
function closeModal() {
  modal.value.open = false;
}

async function submitModal() {
  const { id, status, reason, newStatus, date } = modal.value;
  const today = new Date().toISOString().split("T")[0];

  if (date < today) {
    Swal.fire("Tidak Bisa", "Reservasi yang sudah terlewat tidak dapat diubah.", "error");
    closeModal();
    return;
  }

  Swal.fire({
    title: "Memproses...",
    text: "Mohon tunggu sebentar.",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    if (status === "approved") {
      await reservations.approve(id, reason || "");
      Swal.fire("Berhasil", "Reservasi disetujui!", "success");
    } else if (status === "rejected") {
      if (!reason) {
        Swal.fire("Perhatian", "Alasan wajib diisi untuk menolak!", "warning");
        return;
      }
      await reservations.reject(id, reason);
      Swal.fire("Berhasil", "Reservasi ditolak!", "success");
    } else if (status === "change") {
      await axios.put(`/api/reservations/${id}/status`, { status: newStatus, reason });
      Swal.fire("Berhasil", "Status reservasi berhasil diubah!", "success");
    }
    closeModal();
    fetchData();
  } catch (e) {
    console.error(e);
    Swal.fire("Gagal", "Gagal memproses reservasi.", "error");
  }
}

function confirmChangeStatus(reservation, newStatus) {
  const today = new Date().toISOString().split("T")[0];
  if (reservation.date < today) {
    Swal.fire("Tidak Bisa", "Reservasi yang sudah terlewat tidak dapat diubah.", "error");
    return;
  }

  Swal.fire({
    title: "Yakin ubah status?",
    text: `Ubah status menjadi "${getStatusLabel(newStatus)}"?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya, ubah!",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Memproses...",
        text: "Mohon tunggu sebentar.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      axios
        .put(`/api/reservations/${reservation.id}/status`, {
          status: newStatus,
          reason: reservation.reason || "",
        })
        .then(() => {
          Swal.fire("Berhasil", "Status berhasil diubah!", "success");
          fetchData();
        })
        .catch(() => Swal.fire("Gagal", "Gagal mengubah status.", "error"));
    }
  });
  openDropdown.value = null;
}

onMounted(fetchData);
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
th,
td {
  text-align: left;
}
</style>
