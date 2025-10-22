<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-semibold text-gray-700">Dashboard</h1>
      <!-- Bagian profile dihapus sesuai permintaan -->
    </div>

    <!-- Statistik Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div
        v-for="(card, i) in cards"
        :key="i"
        class="bg-white border border-gray-300 rounded-xl shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition"
      >
        <div>
          <h3 class="text-gray-700 font-semibold text-lg">{{ card.label }}</h3>
          <p class="text-3xl font-bold mt-2 text-gray-900">{{ card.value }}</p>
          <p class="text-sm text-gray-500 mt-1">{{ card.desc }}</p>
        </div>
      </div>
    </div>

    <!-- Grafik Statistik Reservasi -->
    <div
      class="bg-white border border-gray-200 rounded-xl shadow p-6 mb-10"
    >
      <h2 class="text-md font-semibold text-gray-700 mb-4">
        Statistik Reservasi Bulanan
      </h2>
      <div v-if="loadingChart" class="text-gray-500 text-sm">Memuat grafik...</div>
      <BarChart v-else :chart-data="chartData" />
    </div>

    <!-- Jadwal Tetap -->
    <div class="bg-white border border-gray-200 rounded-xl shadow p-6">
      <h2 class="text-md font-semibold text-gray-700 mb-4">Jadwal Tetap Terbaru</h2>
      <div v-if="loadingFixed" class="text-gray-500 text-sm">Memuat data jadwal...</div>

      <table
        v-else
        class="w-full text-sm text-left border-t border-gray-100"
      >
        <thead class="text-gray-600">
          <tr>
            <th class="py-2">Ruangan</th>
            <th class="py-2">Hari</th>
            <th class="py-2">Jam</th>
            <th class="py-2">User</th>
            <th class="py-2">Deskripsi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(fs, i) in fixedSchedules"
            :key="i"
            class="border-t border-gray-100 hover:bg-gray-50"
          >
            <td class="py-2">{{ fs.room?.name || '-' }}</td>
            <td class="py-2">{{ fs.day_of_week }}</td>
            <td class="py-2">{{ fs.start_time }} - {{ fs.end_time }}</td>
            <td class="py-2">{{ fs.user?.name || '-' }}</td>
            <td class="py-2">{{ fs.description || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

   
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import api from '@/api/axios'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// Komponen Chart
const BarChart = {
  props: ['chartData'],
  components: { Bar },
  template: `<Bar :data="chartData" :options="options" />`,
  data() {
    return {
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            grid: { color: '#e5e7eb' },
            ticks: { color: '#4b5563' },
          },
          x: {
            grid: { display: false },
            ticks: { color: '#4b5563' },
          },
        },
      },
    }
  },
}

// State
const stats = ref({
  reservations: 0,
  rooms: 0,
  fixedSchedules: 0,
  users: 0,
  chart: { labels: [], data: [] },
})

const cards = ref([
  { label: 'Daftar Reservasi', value: 0, desc: 'Total reservasi bulan ini' },
  { label: 'Ruangan', value: 0, desc: 'Total ruangan terdaftar' },
  { label: 'Jadwal Tetap', value: 0, desc: 'Total jadwal tetap aktif' },
  { label: 'User', value: 0, desc: 'Total pengguna terdaftar' },
])

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Reservasi',
      data: [],
      backgroundColor: '#00728A',
      borderRadius: 6,
    },
  ],
})

const fixedSchedules = ref([])
const loadingChart = ref(true)
const loadingFixed = ref(true)

onMounted(async () => {
  try {
    // Ambil statistik utama
    const res = await api.get('/dashboard/stats')
    stats.value = res.data

    cards.value[0].value = stats.value.reservations || 0
    cards.value[1].value = stats.value.rooms || 0
    cards.value[2].value = stats.value.fixedSchedules || 0
    cards.value[3].value = stats.value.users || 0

    // Isi grafik dari database
    if (res.data.chart) {
      chartData.value.labels = res.data.chart.labels
      chartData.value.datasets[0].data = res.data.chart.data
    }
  } catch (err) {
    console.error('Gagal memuat data statistik:', err)
  } finally {
    loadingChart.value = false
  }

  // Ambil data fixed schedule
  try {
    const fsRes = await api.get('/fixed-schedules')
    const fsData = fsRes.data.data || fsRes.data
    fixedSchedules.value = fsData.slice(-5).reverse()
  } catch (err) {
    console.error('Gagal memuat data fixed schedule:', err)
  } finally {
    loadingFixed.value = false
  }
})
</script>

<style scoped>
body {
  background-color: #f9fafb;
}
</style>
