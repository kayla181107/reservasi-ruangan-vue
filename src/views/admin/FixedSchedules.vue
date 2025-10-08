<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-6">
    <!-- Card Utama -->
    <div class="w-full max-w-5xl bg-white rounded-3xl shadow-xl p-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <CalendarDays class="w-6 h-6 text-blue-600" />
          Fixed Schedules
        </h2>
        <button
          @click="openForm()"
          class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow transition"
        >
          <Plus class="w-4 h-4" /> Add Schedule
        </button>
      </div>

      <!-- Tabel -->
      <div class="overflow-hidden border border-gray-200 rounded-2xl">
        <table class="w-full text-left">
          <thead class="bg-gray-50 border-b text-gray-600 text-sm">
            <tr>
              <th class="p-3">Room</th>
              <th class="p-3">Day</th>
              <th class="p-3">Time</th>
              <th class="p-3">Description</th>
              <th class="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="s in schedules"
              :key="s.id"
              class="border-b hover:bg-gray-50 transition"
            >
              <td class="p-3">{{ s.room?.name }}</td>
              <td class="p-3 capitalize">{{ s.day_of_week }}</td>
              <td class="p-3">
                {{ formatTime(s.start_time) }} - {{ formatTime(s.end_time) }}
              </td>
              <td class="p-3">{{ s.description || '-' }}</td>
              <td class="p-3 text-right space-x-2">
                <!-- Tombol Edit -->
                <button
                  @click="openForm(s)"
                  class="inline-flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-lg transition"
                >
                  <Edit class="w-4 h-4" />
                </button>

                <!-- Tombol Hapus -->
                <button
                  @click="remove(s.id)"
                  class="inline-flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded-lg transition"
                >
                  <Trash class="w-4 h-4" />
                </button>
              </td>
            </tr>

            <tr v-if="schedules.length === 0">
              <td colspan="5" class="p-6 text-center text-gray-500">
                Belum ada jadwal tetap.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="showForm"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 animate-fade-in"
      >
        <h3 class="text-xl font-semibold text-gray-800 mb-4 text-center">
          {{ form.id ? 'Edit Schedule' : 'Add Schedule' }}
        </h3>

        <div class="space-y-3">
          <!-- Ruangan -->
          <select
            v-model="form.room_id"
            class="w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-400"
          >
            <option disabled value="">-- Pilih Ruangan --</option>
            <option v-for="r in roomsList" :key="r.id" :value="r.id">
              {{ r.name }}
            </option>
          </select>

          <!-- Hari -->
          <select
            v-model="form.day_of_week"
            class="w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-400"
          >
            <option disabled value="">-- Pilih Hari --</option>
            <option value="Senin">Senin</option>
            <option value="Selasa">Selasa</option>
            <option value="Rabu">Rabu</option>
            <option value="Kamis">Kamis</option>
            <option value="Jumat">Jumat</option>
            <option value="Sabtu">Sabtu</option>
            <option value="Minggu">Minggu</option>
          </select>

          <!-- Jam -->
          <div class="flex gap-3">
            <input
              v-model="form.start_time"
              type="time"
              class="w-1/2 border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-400"
            />
            <input
              v-model="form.end_time"
              type="time"
              class="w-1/2 border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <!-- Keterangan -->
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="Keterangan (opsional)"
            class="w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-400"
          ></textarea>
        </div>

        <!-- Tombol -->
        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="showForm = false"
            class="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Batal
          </button>
          <button
            @click="save"
            class="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow transition"
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
import { Edit, Trash, Plus, CalendarDays } from 'lucide-vue-next'

const schedules = ref([])
const roomsList = ref([])
const showForm = ref(false)
const form = ref({
  id: null,
  room_id: '',
  day_of_week: '',
  start_time: '',
  end_time: '',
  description: '',
})

// Ambil semua data
async function fetchData() {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  const res = await axios.get('http://127.0.0.1:8000/api/fixed-schedules', { headers })
  schedules.value = res.data.data || res.data

  const r = await axios.get('http://127.0.0.1:8000/api/rooms', { headers })
  roomsList.value = r.data.data || r.data
}

// Simpan (create/update)
async function save() {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  const payload = {
    room_id: form.value.room_id,
    day_of_week: form.value.day_of_week,
    start_time: form.value.start_time,
    end_time: form.value.end_time,
    description: form.value.description || null,
  }

  try {
    if (form.value.id) {
      await axios.put(`http://127.0.0.1:8000/api/admin/fixed-schedules/${form.value.id}`, payload, { headers })
    } else {
      await axios.post('http://127.0.0.1:8000/api/admin/fixed-schedules', payload, { headers })
    }

    showForm.value = false
    fetchData()
  } catch (error) {
    console.error('Error response:', error.response?.data || error.message)
    alert(error.response?.data?.message || 'Gagal menyimpan jadwal!')
  }
}

// Hapus
async function remove(id) {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  if (confirm('Yakin ingin menghapus jadwal ini?')) {
    await axios.delete(`http://127.0.0.1:8000/api/fixed-schedules/${id}`, { headers })
    fetchData()
  }
}

// Modal buka/edit
function openForm(s = null) {
  form.value = s
    ? { ...s }
    : { id: null, room_id: '', day_of_week: '', start_time: '', end_time: '', description: '' }
  showForm.value = true
}

// Helper format waktu
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
