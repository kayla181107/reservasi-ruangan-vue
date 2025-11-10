<template>
  <div class="min-h-screen bg-white p-6">
    <div class="max-w-4xl mx-auto">

        <div class="bg-white border border-gray-200 rounded-md p-6 mb-6 shadow-md">
        <h1 class="text-3xl font-bold text-gray-900">Tambah Jadwal Tetap</h1>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
          Keterangan
        </h2>

        <div class="mb-6 space-y-4">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
              <i class="ri-time-line text-xl text-gray-700"></i>
            </div>

            <div class="flex flex-wrap gap-3 flex-1">
              <select
                v-model="form.day_of_week"
                class="border border-gray-300 rounded-lg p-2 w-36 focus:ring-2 focus:ring-[#006989]"
              >
                <option disabled value="">Pilih Hari</option>
                <option>Senin</option>
                <option>Selasa</option>
                <option>Rabu</option>
                <option>Kamis</option>
                <option>Jumat</option>
                <option>Sabtu</option>
                <option>Minggu</option>
              </select>

              <input
                v-model="form.start_time"
                type="time"
                class="border border-gray-300 rounded-lg p-2 w-28 focus:ring-2 focus:ring-[#006989]"
              />
              <span class="text-gray-600">-</span>
              <input
                v-model="form.end_time"
                type="time"
                class="border border-gray-300 rounded-lg p-2 w-28 focus:ring-2 focus:ring-[#006989]"
              />
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
              <i class="ri-building-line text-xl text-gray-700"></i>
            </div>
            <select
              v-model="form.room_id"
              class="border border-gray-300 rounded-lg p-2 flex-1 focus:ring-2 focus:ring-[#006989]"
            >
              <option disabled value="">Pilih Ruangan</option>
              <option v-for="r in roomsList" :key="r.id" :value="r.id">
                {{ r.name }}
              </option>
            </select>
          </div>

          <div class="flex items-start gap-3">
            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 mt-1">
              <i class="ri-sticky-note-line text-xl text-gray-700"></i>
            </div>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="Tambahkan keterangan (opsional)"
              class="border border-gray-300 rounded-lg p-3 flex-1 resize-none focus:ring-2 focus:ring-[#006989]"
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-8">
          <router-link
            to="/fixed-schedules"
            class="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200"
          >
            Batal
          </router-link>

          <button
            @click="save"
            class="px-6 py-2.5 rounded-lg font-semibold text-white shadow-md transition-all duration-200
                   bg-[#006989] hover:bg-[#005470] focus:ring-4 focus:ring-[#006989]/30 focus:outline-none"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'

const router = useRouter()
const roomsList = ref([])
const form = ref({
  room_id: '',
  day_of_week: '',
  start_time: '',
  end_time: '',
  description: '', 
})

onMounted(async () => {
  const token = localStorage.getItem('token')
  try {
    const r = await axios.get('http://127.0.0.1:8000/api/rooms', {
      headers: { Authorization: `Bearer ${token}` },
    })
    roomsList.value = r.data.data || r.data
  } catch (e) {
    console.error(e)
    Swal.fire('Gagal', 'Gagal mengambil daftar ruangan.', 'error')
  }
})

async function save() {
  if (!form.value.room_id || !form.value.day_of_week || !form.value.start_time || !form.value.end_time) {
    Swal.fire('Perhatian', 'Semua field wajib diisi!', 'warning')
    return
  }

  const token = localStorage.getItem('token')
  const payload = { ...form.value }

  try {
    Swal.fire({
      title: 'Memproses...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    })
    await axios.post('http://127.0.0.1:8000/api/admin/fixed-schedules', payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
    Swal.fire('Berhasil', 'Jadwal berhasil ditambahkan!', 'success')
    router.push('/fixed-schedules')
  } catch (e) {
    console.error(e)
    Swal.fire('Gagal', e.response?.data?.message || 'Gagal menyimpan jadwal.', 'error')
  }
}
</script>

<style scoped>
button:active {
  transform: scale(0.98);
}
</style>
