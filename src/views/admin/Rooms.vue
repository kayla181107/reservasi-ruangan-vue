<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-indigo-600" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 7l9-4 9 4v10l-9 4-9-4V7z" />
        </svg>
        Ruangan
      </h1>

      <button
        @click="openForm()"
        class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow-md transition-all duration-150 disabled:opacity-50"
        :disabled="loading"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <span v-if="!loading">Tambah Ruangan</span>
        <span v-else>Loading...</span>
      </button>
    </div>

    <!-- Spinner -->
    <div v-if="loading" class="flex items-center gap-2 mb-4 text-gray-600">
      <svg
        class="animate-spin h-6 w-6 text-indigo-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      <span>Memuat data ruangan...</span>
    </div>

    <!-- Table -->
    <div
      v-if="!loading && roomsData.length"
      class="overflow-x-auto bg-white/80 backdrop-blur-md border border-indigo-100 shadow-xl rounded-2xl"
    >
      <table class="w-full border-collapse">
        <thead class="bg-indigo-50/80 text-indigo-700 uppercase text-sm tracking-wide">
          <tr>
            <th class="px-4 py-3 border text-left">ID</th>
            <th class="px-4 py-3 border text-left">Nama</th>
            <th class="px-4 py-3 border text-left">Kapasitas</th>
            <th class="px-4 py-3 border text-left">Deskripsi</th>
            <th class="px-4 py-3 border text-center">Status</th>
            <th class="px-4 py-3 border text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="room in roomsData"
            :key="room.id"
            class="hover:bg-indigo-50/40 transition duration-150"
          >
            <td class="px-4 py-3 border font-medium text-gray-800">{{ room.id }}</td>
            <td class="px-4 py-3 border font-medium text-gray-800">{{ room.name }}</td>
            <td class="px-4 py-3 border text-gray-600">{{ room.capacity }}</td>
            <td class="px-4 py-3 border text-gray-600">{{ room.description }}</td>
            <td class="px-4 py-3 border text-center">
              <span
                :class="room.status === 'active'
                  ? 'bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-semibold'
                  : 'bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-semibold'"
              >
                {{ room.status }}
              </span>
            </td>
            <td class="px-4 py-3 border text-center">
              <div class="flex justify-center gap-2">
                <!-- Edit SVG -->
                <button
                  @click="openForm(room)"
                  class="p-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-all shadow-md"
                  title="Edit Ruangan"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" />
                  </svg>
                </button>

                <!-- Hapus SVG -->
                <button
                  @click="remove(room.id)"
                  class="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all shadow-md"
                  title="Hapus Ruangan"
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

    <!-- Empty state -->
    <p
      v-if="!loading && roomsData.length === 0"
      class="text-gray-500 text-center mt-6 italic"
    >
      Belum ada ruangan yang tersedia.
    </p>

    <!-- Modal -->
    <transition name="fade">
      <div
        v-if="showForm"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <div
          class="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn"
        >
          <h3 class="text-xl font-semibold mb-4 text-gray-800">
            {{ form.id ? 'Edit Ruangan' : 'Tambah Ruangan' }}
          </h3>

          <!-- Nama -->
          <div class="mb-3">
            <label class="text-gray-700 text-sm font-medium">Nama Ruangan</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Nama Ruangan"
              class="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          <!-- Kapasitas -->
          <div class="mb-3">
            <label class="text-gray-700 text-sm font-medium">Kapasitas</label>
            <input
              v-model.number="form.capacity"
              type="number"
              min="1"
              placeholder="Kapasitas"
              class="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          <!-- Deskripsi -->
          <div class="mb-3">
            <label class="text-gray-700 text-sm font-medium">Deskripsi</label>
            <textarea
              v-model="form.description"
              placeholder="Deskripsi"
              class="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            ></textarea>
          </div>

          <!-- Status -->
          <div class="flex items-center gap-2 mb-4">
            <input
              v-model="form.status"
              type="checkbox"
              true-value="active"
              false-value="inactive"
              id="status"
              class="rounded text-green-600"
            />
            <label for="status" class="text-gray-700 text-sm font-medium">Active</label>
          </div>

          <!-- Tombol -->
          <div class="mt-4 flex justify-end gap-3">
            <button
              @click="showForm = false"
              class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
            >
              Batal
            </button>
            <button
              @click="save"
              class="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold disabled:opacity-50 transition"
              :disabled="loading"
            >
              {{ loading ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { rooms } from '@/api/rooms'

const roomsData = ref([])
const showForm = ref(false)
const loading = ref(false)
const form = ref({
  id: '',
  name: '',
  capacity: 1,
  description: '',
  status: 'active',
})

async function fetchRooms() {
  try {
    loading.value = true
    const { data } = await rooms.all()
    roomsData.value = Array.isArray(data) ? data : data.data
  } catch (e) {
    console.error('Fetch failed', e)
    alert('Gagal memuat data ruangan ❌')
  } finally {
    loading.value = false
  }
}

function openForm(r = null) {
  form.value = r
    ? { ...r }
    : { id: '', name: '', capacity: 1, description: '', status: 'active' }
  showForm.value = true
}

async function save() {
  if (!form.value.name) {
    alert('Nama ruangan wajib diisi ❌')
    return
  }
  if (!form.value.capacity || form.value.capacity < 1) {
    alert('Kapasitas minimal 1 ❌')
    return
  }

  try {
    loading.value = true
    if (form.value.id) {
      await rooms.update(form.value.id, { ...form.value })
      alert('Ruangan berhasil diperbarui ✅')
    } else {
      await rooms.create({ ...form.value })
      alert('Ruangan berhasil ditambahkan ✅')
    }
    showForm.value = false
    fetchRooms()
  } catch (e) {
    console.error('Save failed', e)
    alert('Terjadi kesalahan saat menyimpan data ❌')
  } finally {
    loading.value = false
  }
}

async function remove(id) {
  if (confirm('Yakin ingin menghapus ruangan ini?')) {
    try {
      loading.value = true
      await rooms.delete(id)
      alert('Ruangan berhasil dihapus ✅')
      fetchRooms()
    } catch (e) {
      console.error('Delete failed', e)
      alert('Gagal menghapus ruangan ❌')
    } finally {
      loading.value = false
    }
  }
}

onMounted(fetchRooms)
</script>

<style scoped>
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
