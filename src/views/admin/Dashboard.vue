<template>
  <div class="space-y-6 animate-fadeIn bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 p-6 rounded-3xl shadow-xl">
    <!-- Header -->
    <div class="flex items-center justify-between bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-400 p-5 rounded-2xl shadow-lg text-white">
      <h1 class="text-2xl font-bold flex items-center gap-2">📊 Dashboard</h1>
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shadow-md">
          <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 
              2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 
              1.7-10 5v1h20v-1c0-3.3-6.7-5-10-5z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      <div
        v-for="(card, i) in cards"
        :key="i"
        class="flex flex-col items-center justify-between p-6 rounded-2xl shadow-md transition transform hover:-translate-y-2 hover:shadow-2xl bg-white/90 backdrop-blur-sm border border-purple-100"
      >
        <div class="text-center mb-4">
          <h3 class="text-sm font-semibold text-gray-600">{{ card.label }}</h3>
          <p class="text-3xl font-extrabold mt-1" :class="card.textColor">
            {{ card.value }}
          </p>
        </div>
        <div class="p-4 rounded-xl text-white shadow-md" :class="card.iconBg">
          <component :is="card.icon" class="w-7 h-7" />
        </div>
      </div>
    </div>

    <!-- Latest Fixed Schedules -->
    <div class="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-purple-100">
      <h2 class="text-lg font-semibold mb-4 text-yellow-600">🕒 Latest Fixed Schedules</h2>

      <div v-if="loading" class="text-gray-500">Loading data...</div>

      <table v-else class="w-full text-sm text-left">
        <thead>
          <tr class="text-gray-600 border-b">
            <th class="py-2">Ruangan</th>
            <th class="py-2">Hari</th>
            <th class="py-2">Jam</th>
            <th class="py-2">User</th>
            <th class="py-2">Deskripsi</th>

          </tr>
        </thead>
        <tbody>
  <tr v-for="(fs, i) in latestFixedSchedules" :key="i" class="border-b hover:bg-gray-50">
    <td class="py-2">{{ fs.room?.name || '-' }}</td>
    <td class="py-2">{{ fs.day_of_week }}</td>
    <td class="py-2">{{ fs.start_time }} - {{ fs.end_time }}</td>
    <td class="py-2">{{ fs.user?.name || '-' }}</td>
    <td class="py-2">{{ fs.description || '-' }}</td>
  </tr>
</tbody>


      </table>
    </div>

    <!-- Chart -->
    <div class="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg animate-slideUp border border-purple-100">
      <h2 class="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-600">
        📈 Reservations per Month
      </h2>
      <BarChart :chart-data="chartData" />
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

// Heroicons
import {
  BuildingOfficeIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/vue/24/solid'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

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
          y: { grid: { color: '#f3f4f6' }, ticks: { color: '#6b7280' } },
          x: { grid: { display: false }, ticks: { color: '#6b7280' } },
        },
      },
    }
  },
}

// State
const stats = ref({
  rooms: 0,
  reservations: 0,
  approved: 0,
  rejected: 0,
  fixedSchedules: 0,
})
const cards = ref([
  { label: 'Total Rooms', value: 0, icon: BuildingOfficeIcon, iconBg: 'bg-blue-500', textColor: 'text-blue-600' },
  { label: 'Total Reservations', value: 0, icon: CalendarDaysIcon, iconBg: 'bg-purple-500', textColor: 'text-purple-600' },
  { label: 'Approved', value: 0, icon: CheckCircleIcon, iconBg: 'bg-emerald-500', textColor: 'text-emerald-600' },
  { label: 'Rejected', value: 0, icon: XCircleIcon, iconBg: 'bg-rose-500', textColor: 'text-rose-600' },
  { label: 'Fixed Schedules', value: 0, icon: ClockIcon, iconBg: 'bg-yellow-500', textColor: 'text-yellow-600' },
])
const chartData = ref({ labels: [], datasets: [{ label: 'Reservations', data: [], backgroundColor: 'rgba(139, 92, 246, 0.7)', borderRadius: 8 }] })

const latestFixedSchedules = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await api.get('/dashboard/stats')
    stats.value = res.data
    cards.value[0].value = stats.value.rooms
    cards.value[1].value = stats.value.reservations
    cards.value[2].value = stats.value.approved
    cards.value[3].value = stats.value.rejected
    cards.value[4].value = stats.value.fixedSchedules
    chartData.value.labels = res.data.chart.labels
    chartData.value.datasets[0].data = res.data.chart.data

    const fsRes = await api.get('/fixed-schedules')
    const fsData = fsRes.data.data || fsRes.data
    latestFixedSchedules.value = fsData.slice(-5).reverse()
  } catch (err) {
    console.error('Error loading dashboard stats:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn { animation: fadeIn 0.8s ease-in-out; }
.animate-slideUp { animation: slideUp 1s ease-in-out; }
</style>
