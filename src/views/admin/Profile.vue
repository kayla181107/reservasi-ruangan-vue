<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
    <div class="max-w-2xl w-full bg-white shadow-xl rounded-3xl p-8 sm:p-12 flex flex-col">
      
      <!-- Header -->
      <div class="flex items-center gap-4 mb-8">
        <div
          class="w-16 h-16 rounded-full bg-gradient-to-br from-[#006989] to-[#005766] flex items-center justify-center text-3xl font-bold text-white"
        >
          {{ profile.name?.charAt(0).toUpperCase() || 'U' }}
        </div>
        <div>
          <h2 class="text-3xl font-semibold text-gray-800">Profile Settings</h2>
          <p class="text-gray-500 mt-1 text-sm">Perbarui informasi pribadi Anda</p>
        </div>
      </div>

      <!-- Form -->
      <div class="space-y-6 flex-1">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            v-model="profile.name"
            class="border border-gray-300 w-full p-3 rounded-xl focus:ring-2 focus:ring-[#006989] focus:outline-none transition"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="profile.email"
            type="email"
            class="border border-gray-300 w-full p-3 rounded-xl focus:ring-2 focus:ring-[#006989] focus:outline-none transition"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <input
            v-model="profile.role"
            disabled
            class="border border-gray-200 w-full p-3 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
          />
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-4 mt-8">
        <button
          @click="cancel"
          class="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 transition font-medium"
        >
          Cancel
        </button>
        <button
          :disabled="loading"
          @click="update"
          class="px-6 py-3 rounded-xl bg-[#006989] text-white hover:bg-[#005766] transition font-medium disabled:opacity-50"
        >
          <span v-if="loading">Updating...</span>
          <span v-else>Update</span>
        </button>
      </div>

      <!-- Tombol Logout Modern -->
      <div class="mt-8 border-t border-gray-200 pt-4">
        <button
          @click="logout"
          class="flex items-center justify-center w-full px-5 py-3 rounded-3xl bg-[#006989] text-white font-semibold shadow-lg hover:bg-[#005766] hover:scale-105 transition-all duration-300"
        >
          <ArrowRightOnRectangleIcon class="w-6 h-6 mr-3" />
          Logout
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { auth } from '@/api/auth'
import router from '@/router'
import { ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'

const profile = ref({ name: '', email: '', role: '' })
const loading = ref(false)

onMounted(async () => {
  try {
    const res = await auth.profile()
    profile.value = res.data
  } catch (err) {
    console.error(err)
  }
})

async function update() {
  loading.value = true
  try {
    await auth.updateProfile(profile.value) // pastikan nama method sesuai auth.js
    alert('✅ Profil berhasil diperbarui!')
  } catch (err) {
    console.error(err)
    alert('❌ Gagal memperbarui profil')
  } finally {
    loading.value = false
  }
}

function cancel() {
  router.push('/admin')
}

async function logout() {
  try {
    await auth.logout() // panggil API logout
    localStorage.removeItem('token') // hapus token lokal
    router.push('/login') // redirect ke login
  } catch (err) {
    console.error('Logout gagal:', err)
    alert('❌ Gagal logout')
  }
}
</script>
