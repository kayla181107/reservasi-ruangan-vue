<template>
  <div>
    <!-- Tombol Add -->
    <button
      @click="openForm()"
      class="bg-blue-600 text-white px-4 py-2 rounded mb-4 disabled:opacity-50"
      :disabled="loading"
    >
      {{ loading ? 'Loading...' : 'Add Room' }}
    </button>

    <!-- Spinner loading -->
    <div v-if="loading" class="flex items-center gap-2 mb-4 text-gray-600">
      <svg
        class="animate-spin h-5 w-5 text-blue-600"
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
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      <span>Loading data...</span>
    </div>

    <!-- Tabel -->
    <table class="w-full border" v-if="!loading && roomsData.length">
      <thead>
        <tr class="bg-gray-100">
          <th class="border px-2 py-1">Name</th>
          <th class="border px-2 py-1">Capacity</th>
          <th class="border px-2 py-1">Description</th>
          <th class="border px-2 py-1">Status</th>
          <th class="border px-2 py-1">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="room in roomsData" :key="room.id">
          <td class="border px-2 py-1">{{ room.name }}</td>
          <td class="border px-2 py-1">{{ room.capacity }}</td>
          <td class="border px-2 py-1">{{ room.description }}</td>
          <td class="border px-2 py-1">
            <span :class="room.status === 'aktif' ? 'text-green-600' : 'text-red-600'">
              {{ room.status }}
            </span>
          </td>
          <td class="border px-2 py-1 flex gap-2">
            <button @click="openForm(room)" class="bg-yellow-500 text-white px-2 py-1 rounded">
              Edit
            </button>
            <button @click="remove(room.id)" class="bg-red-600 text-white px-2 py-1 rounded">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Empty state -->
    <p v-if="!loading && roomsData.length === 0" class="text-gray-500">No rooms found.</p>

    <!-- Modal Form -->
    <div
      v-if="showForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-6 rounded w-96">
        <h3 class="text-lg mb-4">
          {{ form.id ? 'Edit Room' : 'Add Room' }}
        </h3>

        <!-- Nama -->
        <input v-model="form.name" placeholder="Name" class="w-full border p-2 mb-2" required />

        <!-- Kapasitas -->
        <input
          v-model.number="form.capacity"
          type="number"
          placeholder="Capacity"
          min="1"
          class="w-full border p-2 mb-2"
          required
        />

        <!-- Deskripsi -->
        <textarea
          v-model="form.description"
          placeholder="Description"
          class="w-full border p-2 mb-2"
        ></textarea>

        <!-- Status -->
        <label class="flex items-center gap-2">
          <input v-model="form.status" type="checkbox" true-value="Active" false-value="Inactive" />
          Active
        </label>

        <div class="mt-4 flex justify-end gap-2">
          <button @click="showForm = false">Cancel</button>
          <button
            @click="save"
            class="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            :disabled="loading"
          >
            {{ loading ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { rooms } from '@/api/rooms'

const roomsData = ref([])
const showForm = ref(false)
const loading = ref(false)
const form = ref({
  id: null,
  name: '',
  kapasitas: 1,
  deskripsi: '',
  status: 'active',
})

async function fetchRooms() {
  try {
    loading.value = true
    const { data } = await rooms.all()
    roomsData.value = Array.isArray(data) ? data : data.data
  } catch (e) {
    console.error('Fetch failed', e)
  } finally {
    loading.value = false
  }
}

function openForm(r = null) {
  form.value = r ? { ...r } : { id: null, name: '', kapasitas: 1, deskripsi: '', status: 'active' }
  showForm.value = true
}

async function save() {
  if (!form.value.name) {
    alert('Nama ruangan wajib diisi')
    return
  }
  if (!form.value.capacity || form.value.capacity < 1) {
    alert('Kapasitas minimal 1')
    return
  }

  try {
    loading.value = true
    if (form.value.id) {
      await rooms.update(form.value.id, { ...form.value })
    } else {
      await rooms.create({ ...form.value })
    }
    showForm.value = false
    fetchRooms()
  } catch (e) {
    console.error('Save failed', e.response?.data || e)
    alert(JSON.stringify(e.response?.data || e))
  } finally {
    loading.value = false
  }
}

async function remove(id) {
  if (confirm('Delete this room?')) {
    try {
      loading.value = true
      await rooms.delete(id)
      fetchRooms()
    } catch (e) {
      console.error('Delete failed', e)
    } finally {
      loading.value = false
    }
  }
}

onMounted(fetchRooms)
</script>
