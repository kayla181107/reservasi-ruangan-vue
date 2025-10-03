<template>
  <div class="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-6">
      <div
        class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-2xl font-bold text-green-700"
      >
        {{ profile.name?.charAt(0).toUpperCase() || 'U' }}
      </div>
      <div>
        <h2 class="text-2xl font-semibold text-gray-800">Profile Settings</h2>
        <p class="text-gray-500 text-sm">Perbarui informasi pribadi Anda</p>
      </div>
    </div>

    <!-- Form -->
    <div class="space-y-4">
      <!-- Name -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          v-model="profile.name"
          class="border border-gray-300 w-full p-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      <!-- Email -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          v-model="profile.email"
          type="email"
          class="border border-gray-300 w-full p-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      <!-- Role -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
        <input
          v-model="profile.role"
          disabled
          class="border border-gray-200 w-full p-2 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
        />
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex justify-end gap-3 mt-6">
      <button
        @click="cancel"
        class="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
      >
        Cancel
      </button>
      <button
        @click="update"
        class="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
      >
        Update
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { auth } from '@/api/auth'
import router from '@/router'

const profile = ref({ name: '', email: '', role: '' })

onMounted(async () => {
  try {
    const res = await auth.profile()
    profile.value = res.data
  } catch (err) {
    console.error(err)
  }
})

async function update() {
  try {
    await auth.update(profile.value)
    alert('✅ Profil berhasil diperbarui!')
  } catch (err) {
    console.error(err)
    alert('❌ Gagal memperbarui profil')
  }
}

function cancel() {
  router.push('/admin')
}
</script>
