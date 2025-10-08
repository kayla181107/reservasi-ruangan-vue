<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-indigo-600" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 
              00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Daftar Reservasi</span>
        </h2>

        <button
          @click="fetchData"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all duration-150 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M4 4v5h.582M20 20v-5h-.581M4 9h16M4 15h16M12 4v16" />
          </svg>
          Refresh
        </button>
      </div>

      <!-- Empty State -->
      <div
        v-if="!reservationsList.length"
        class="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-10 text-center text-gray-500"
      >
        <p class="text-lg font-medium">Belum ada reservasi ditemukan</p>
      </div>

      <!-- Table -->
      <div
        v-else
        class="overflow-x-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-indigo-100"
      >
        <table class="w-full text-left border-collapse">
          <thead class="bg-indigo-50/70 text-indigo-700 text-sm uppercase tracking-wide">
            <tr>
              <th class="p-3 font-semibold">User</th>
              <th class="p-3 font-semibold">Ruangan</th>
              <th class="p-3 font-semibold">Tanggal</th>
              <th class="p-3 font-semibold">Hari</th>
              <th class="p-3 font-semibold">Jam</th>
              <th class="p-3 font-semibold">Status</th>
              <th class="p-3 font-semibold">Keterangan</th>
              <th class="p-3 font-semibold text-center w-[130px]">Aksi</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="r in reservationsList"
              :key="r.id"
              class="border-t hover:bg-indigo-50/40 transition duration-150"
            >
              <td class="p-3 text-gray-800 font-medium">{{ r.user?.name }}</td>
              <td class="p-3 text-gray-600">{{ r.room?.name }}</td>
              <td class="p-3 text-gray-600">{{ r.date }}</td>
              <td class="p-3 capitalize text-gray-600">{{ r.day_of_week }}</td>
              <td class="p-3 text-gray-600">{{ r.start_time }} - {{ r.end_time || r.start_time }}</td>
              <td class="p-3">
                <span
                  v-if="r.status === 'approved'"
                  class="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700"
                  >Approved</span
                >
                <span
                  v-else-if="r.status === 'rejected'"
                  class="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700"
                  >Rejected</span
                >
                <span
                  v-else
                  class="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600"
                  >Pending</span
                >
              </td>
              <td class="p-3 text-sm text-gray-500">{{ r.reason || '-' }}</td>

              <!-- Aksi -->
              <td class="p-3 text-center">
                <div class="flex justify-center items-center gap-2">
                  <!-- Approve -->
                  <button
                    @click="openModal(r.id, 'approved')"
                    class="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 hover:scale-105 transition-all duration-150 shadow-sm"
                    title="Setujui"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>

                  <!-- Reject -->
                  <button
                    @click="openModal(r.id, 'rejected')"
                    class="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 hover:scale-105 transition-all duration-150 shadow-sm"
                    title="Tolak"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <!-- Delete -->
                  <button
                    @click="remove(r.id)"
                    class="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105 transition-all duration-150 shadow-sm"
                    title="Hapus"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 
                        0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 
                        0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <transition name="fade">
        <div v-if="modal.open" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all animate-fadeIn"
          >
            <h3 class="text-xl font-bold mb-3 text-gray-800">
              {{ modal.status === 'approved' ? 'Setujui Reservasi' : 'Tolak Reservasi' }}
            </h3>
            <p class="text-sm text-gray-500 mb-4">
              {{ modal.status === 'approved'
                ? 'Tambahkan catatan jika diperlukan (opsional).'
                : 'Tulis alasan penolakan secara singkat.' }}
            </p>

            <textarea
              v-model="modal.reason"
              rows="3"
              class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-200 focus:outline-none mb-4"
              :placeholder="modal.status === 'approved'
                ? 'Opsional...'
                : 'Tulis alasan penolakan...'"
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
                :class="modal.status === 'approved'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'"
              >
                {{ modal.status === 'approved' ? 'Setujui' : 'Tolak' }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { reservations } from '@/api/reservations'
import { ref, onMounted } from 'vue'

const reservationsList = ref([])
const modal = ref({ open: false, id: null, status: null, reason: '' })

async function fetchData() {
  try {
    const res = await reservations.all()
    reservationsList.value = res.data?.data ?? res.data
  } catch (e) {
    console.error(e)
    alert('Gagal mengambil data reservasi.')
  }
}

function openModal(id, status) {
  modal.value = { open: true, id, status, reason: '' }
}

function closeModal() {
  modal.value.open = false
}

async function submitModal() {
  const { id, status, reason } = modal.value
  try {
    if (status === 'approved') {
      await reservations.approve(id, reason || '')
      alert('Reservasi disetujui!')
    } else if (status === 'rejected') {
      if (!reason) {
        alert('Alasan wajib diisi untuk menolak!')
        return
      }
      await reservations.reject(id, reason)
      alert('Reservasi ditolak!')
    }
    closeModal()
    fetchData()
  } catch (e) {
    console.error(e)
    alert('Gagal memproses reservasi.')
  }
}

async function remove(id) {
  if (confirm('Yakin ingin menghapus reservasi ini?')) {
    try {
      await reservations.destroy(id)
      alert('Reservasi berhasil dihapus!')
      fetchData()
    } catch (e) {
      console.error(e)
      alert('Gagal menghapus reservasi.')
    }
  }
}

onMounted(fetchData)
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
.animate-fadeIn {
  animation: fadeIn 0.3s ease;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
