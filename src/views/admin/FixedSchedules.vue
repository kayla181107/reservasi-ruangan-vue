<template>
  <div class="min-h-screen bg-white p-6">
    <div class="max-w-7xl mx-auto">

      <!-- Header -->
      <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-lg shadow-gray-300/70">
        <h1 class="text-3xl font-bold text-gray-900">Jadwal Tetap</h1>
      </div>

      <!-- Tombol Tambah -->
      <div class="flex items-center mb-6">
        <router-link
          to="/admin/tambah-fixed-schedule"
          class="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-4 py-2 rounded-md shadow transition"
        >
          <CalendarPlus class="w-5 h-5" />
          Tambah
        </router-link>
      </div>

      <!-- List Jadwal -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div
          v-for="s in schedules"
          :key="s.id"
          class="bg-white rounded-lg border border-gray-200 shadow-md p-4 hover:shadow-lg transition"
        >
          <h3 class="text-lg font-semibold text-gray-800 mb-1">
            {{ s.room?.name || 'Tanpa Ruangan' }}
          </h3>
          <p class="text-sm text-gray-700">
            <span class="font-medium">Hari:</span>
            {{ s.day_of_week }}
          </p>
          <p class="text-sm text-gray-700">
            <span class="font-medium">Waktu:</span>
            {{ formatTime(s.start_time) }} - {{ formatTime(s.end_time) }}
          </p>
          <p class="text-sm text-gray-700 mt-1">
            <span class="font-medium">Keterangan:</span>
            {{ s.description || '-' }}
          </p>

          <div class="flex justify-center gap-3 mt-5">
            <router-link
              :to="`/admin/edit-fixed-schedule/${s.id}`"
              class="bg-green-500 hover:bg-green-600 text-white px-8 py-1 rounded-full text-sm font-medium shadow-sm transition"
            >
              Edit
            </router-link>
            <button
              @click="remove(s.id)"
              class="bg-red-500 hover:bg-red-600 text-white px-8 py-1 rounded-full text-sm font-medium shadow-sm transition"
            >
              Hapus
            </button>
          </div>
        </div>

        <div
          v-if="schedules.length === 0"
          class="col-span-full text-center text-gray-500 py-10"
        >
          Belum ada jadwal tetap.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { CalendarPlus } from 'lucide-vue-next'

const schedules = ref([])
const roomsList = ref([])

async function fetchData() {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    Swal.fire({
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    })

    const res = await axios.get('http://127.0.0.1:8000/api/fixed-schedules', { headers })
    schedules.value = res.data.data || res.data

    const r = await axios.get('http://127.0.0.1:8000/api/rooms', { headers })
    roomsList.value = r.data.data || r.data

    Swal.close()
  } catch (err) {
    console.error('Gagal fetch data:', err)
    Swal.fire('Gagal', 'Gagal mengambil data jadwal tetap.', 'error')
  }
}

async function remove(id) {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  if (!confirm('Yakin ingin menghapus jadwal ini?')) return

  try {
    Swal.fire({
      title: 'Memproses...',
      text: 'Sedang menghapus jadwal.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    })

    await axios.delete(`http://127.0.0.1:8000/api/fixed-schedules/${id}`, { headers })

    await Swal.fire({
      title: 'Jadwal Tetap tersebut telah berhasil dihapus.',
      confirmButtonText: 'Oke',
      confirmButtonColor: '#006989',
      icon: 'success',
    })

    fetchData()
  } catch (err) {
    console.error('Gagal hapus jadwal:', err)
    Swal.fire('Gagal', 'Gagal menghapus jadwal!', 'error')
  }
}

function formatTime(t) {
  return t ? t.slice(0, 5) : ''
}

onMounted(fetchData)
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>
