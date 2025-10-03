<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">Reservations</h2>

    ```
    <!-- Empty state -->
    <div v-if="!reservationsList.length" class="text-center py-10 text-gray-500">
      Tidak ada reservasi ditemukan.
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto bg-white shadow rounded-lg">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-100 sticky top-0">
          <tr>
            <th class="p-3 text-sm font-semibold text-gray-600">User</th>
            <th class="p-3 text-sm font-semibold text-gray-600">Room</th>
            <th class="p-3 text-sm font-semibold text-gray-600">Tanggal</th>
            <th class="p-3 text-sm font-semibold text-gray-600">Hari</th>
            <th class="p-3 text-sm font-semibold text-gray-600">Jam</th>
            <th class="p-3 text-sm font-semibold text-gray-600">Status</th>
            <th class="p-3 text-sm font-semibold text-gray-600">Reason</th>
            <th class="p-3 text-sm font-semibold text-gray-600 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="r in reservationsList"
            :key="r.id"
            class="border-t hover:bg-gray-50 transition"
          >
            <td class="p-3">{{ r.user?.name }}</td>
            <td class="p-3">{{ r.room?.name }}</td>
            <td class="p-3">{{ r.date }}</td>
            <td class="p-3">{{ r.day_of_week }}</td>
            <td class="p-3">{{ r.start_time }} - {{ r.start_time }}</td>
            <td class="p-3">
              <span
                v-if="r.status === 'approved'"
                class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700"
                >Approved</span
              >
              <span
                v-else-if="r.status === 'rejected'"
                class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700"
                >Rejected</span
              >
              <span
                v-else
                class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700"
                >Pending</span
              >
            </td>
            <td class="p-3 text-sm text-gray-600">{{ r.reason || '-' }}</td>
            <td class="p-3 text-right space-x-2">
              <button
                @click="openModal(r.id, 'approved')"
                class="p-1 rounded hover:bg-green-100 text-green-600"
                title="Approve"
              >
                ✔
              </button>
              <button
                @click="openModal(r.id, 'rejected')"
                class="p-1 rounded hover:bg-red-100 text-red-600"
                title="Reject"
              >
                ✖
              </button>
              <button
                @click="remove(r.id)"
                class="p-1 rounded hover:bg-gray-100 text-gray-600"
                title="Delete"
              >
                🗑
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <transition name="fade">
      <div
        v-if="modal.open"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 animate-fadeIn">
          <h3 class="text-lg font-semibold mb-4">
            {{ modal.status === 'approved' ? 'Approve Reservation' : 'Reject Reservation' }}
          </h3>

          <label class="block mb-2 text-sm font-medium">
            {{ modal.status === 'approved' ? 'Catatan (opsional)' : 'Alasan (wajib)' }}
          </label>
          <textarea
            v-model="modal.reason"
            rows="3"
            class="w-full border rounded p-2 mb-4 focus:ring focus:ring-blue-200"
            :placeholder="modal.status === 'approved' ? 'Opsional...' : 'Tulis alasan di sini...'"
          ></textarea>

          <div class="flex justify-end space-x-2">
            <button @click="closeModal" class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
              Cancel
            </button>
            <button
              @click="submitModal"
              class="px-3 py-1 rounded text-white"
              :class="
                modal.status === 'approved'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              "
            >
              {{ modal.status === 'approved' ? 'Approve' : 'Reject' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
    ```
  </div>
</template>

<script setup>
import { reservations } from '@/api/reservations'
import { ref, onMounted } from 'vue'

const reservationsList = ref([])

const modal = ref({
  open: false,
  id: null,
  status: null,
  reason: '',
})

async function fetchData() {
  try {
    const res = await reservations.all()
    reservationsList.value = res.data?.data ?? res.data
  } catch (e) {
    console.error('Fetch failed', e.response?.data || e)
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
    } else if (status === 'rejected') {
      if (!reason) {
        alert('Alasan wajib diisi untuk reject!')
        return
      }
      await reservations.reject(id, reason)
    }
    closeModal()
    fetchData()
  } catch (e) {
    console.error('Submit failed', e.response?.data || e)
    alert('Gagal memproses reservasi.')
  }
}

async function remove(id) {
  if (confirm('Delete reservation?')) {
    try {
      await reservations.destroy(id)
      fetchData()
    } catch (e) {
      console.error('Delete failed', e.response?.data || e)
      alert('Gagal menghapus reservasi.')
    }
  }
}

onMounted(fetchData)
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
