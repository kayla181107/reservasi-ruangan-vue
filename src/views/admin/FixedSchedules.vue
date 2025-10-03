<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between mb-4">
      <h2 class="text-xl font-semibold">Fixed Schedules</h2>
      <button @click="openForm()" class="bg-green-600 text-white px-4 py-2 rounded">+ Add</button>
    </div>

    <!-- Tabel -->
    <table class="w-full bg-white shadow rounded border">
      <thead class="bg-gray-100 text-left">
        <tr>
          <th class="p-3">Room</th>
          <th class="p-3">Hari</th>
          <th class="p-3">Jam</th>
          <th class="p-3">Keterangan</th>
          <th class="p-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in schedules" :key="s.id" class="border-t hover:bg-gray-50">
          <td class="p-3">{{ s.room?.name }}</td>
          <td class="p-3">{{ s.day_of_week }}</td>
          <td class="p-3">{{ formatTime(s.start_time) }} - {{ formatTime(s.start_time) }}</td>
          <td class="p-3">{{ s.description || '-' }}</td>
          <td class="p-3 text-right">
            <button @click="openForm(s)" class="px-2 text-blue-600">✏️</button>
            <button @click="remove(s.id)" class="px-2 text-red-600">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Form -->
    <div
      v-if="showForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-6 rounded w-96 shadow-lg">
        <h3 class="text-lg mb-4 font-semibold">
          {{ form.id ? 'Edit Schedule' : 'Add Schedule' }}
        </h3>

        <!-- Pilih ruangan -->
        <select v-model="form.room_id" class="w-full border p-2 mb-2 rounded">
          <option disabled value="">-- Pilih Ruangan --</option>
          <option v-for="r in roomsList" :key="r.id" :value="r.id">
            {{ r.name }}
          </option>
        </select>

        <!-- Tanggal -->
        <input
          v-model="form.date"
          type="date"
          class="w-full border p-2 mb-2 rounded"
          @change="updateHari"
        />

        <!-- Hari (auto, readonly, tetap dikirim ke backend) -->
        <input
          v-model="form.day_of_week"
          placeholder="Hari"
          class="w-full border p-2 mb-2 rounded bg-gray-100"
          readonly
        />

        <!-- Jam mulai -->
        <input v-model="form.start_time" type="time" class="w-full border p-2 mb-2 rounded" />

        <!-- Jam selesai -->
        <input v-model="form.end_time" type="time" class="w-full border p-2 mb-2 rounded" />

        <!-- Keterangan -->
        <textarea
          v-model="form.description"
          placeholder="Keterangan"
          rows="3"
          class="w-full border p-2 mb-2 rounded"
        ></textarea>

        <!-- Tombol -->
        <div class="flex justify-end gap-2 mt-4">
          <button @click="showForm = false" class="px-4 py-2 rounded border">Cancel</button>
          <button @click="save" class="bg-green-600 text-white px-4 py-2 rounded">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fixedSchedules } from '@/api/fixedSchedules'
import { rooms } from '@/api/rooms'

/* State */
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

/* Ambil data awal */
async function fetchData() {
  const res = await fixedSchedules.all()
  schedules.value = res.data?.data || res.data || []

  const r = await rooms.all()
  roomsList.value = r.data?.data || r.data || []
}

/* Buka modal (new/edit) */
function openForm(s = null) {
  form.value = s
    ? {
        id: s.id,
        room_id: s.room_id,
        day_of_week: s.day_of_week,
        start_time: s.start_time?.slice(0, 5) || '',
        end_time: s.end_time?.slice(0, 5) || '',
        description: s.description || '',
      }
    : {
        id: null,
        room_id: '',
        day_of_week: '',
        start_time: '',
        end_time: '',
        description: '',
      }

  showForm.value = true
}



/* Simpan data */
async function save() {
  const payload = {
    room_id: form.value.room_id,
    day_of_week: form.value.day_of_week,
    start_time: form.value.start_time?.slice(0, 5),
    end_time: form.value.end_time?.slice(0, 5),
    description: form.value.description || null,
  }

  console.log(' Payload yang dikirim ke backend:', payload)

  try {
    if (form.value.id) {
      await fixedSchedules.update(form.value.id, payload)
    } else {
      await fixedSchedules.create(payload)
    }

    showForm.value = false
    fetchData()
  } catch (error) {
    console.error('Error response:', error.response?.data || error.message)
    alert('Gagal menyimpan jadwal! Detail ada di console.')
  }
}

/* Hapus data */
async function remove(id) {
  if (confirm('Delete schedule?')) {
    await fixedSchedules.delete(id)
    fetchData()
  }
}

/* Format tampilan */
function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toISOString().split('T')[0]
}

function formatTime(timeStr) {
  return timeStr ? timeStr.slice(0, 5) : ''
}

onMounted(fetchData)
</script>
