<template>
  <div class="space-y-6 animate-fadeIn">
    <!-- Header dengan foto profil default -->
    <div class="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-2xl shadow-lg">
      <h1 class="text-2xl font-bold text-gray-700 flex items-center gap-2">
        📊 Dashboard
      </h1>
      <div class="flex items-center gap-3">
        <div
          class="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center shadow-md"
        >
          <!-- Icon user default -->
          <svg
            class="w-7 h-7 text-indigo-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v1h20v-1c0-3.3-6.7-5-10-5z"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="(card, i) in cards"
        :key="i"
        class="p-6 rounded-2xl shadow-md transition transform hover:-translate-y-2 hover:shadow-xl bg-gradient-to-br"
        :class="card.gradient"
      >
        <div class="flex items-center gap-4">
          <div
            class="p-4 rounded-xl text-white shadow-md"
            :class="card.iconBg"
          >
            <component :is="card.icon" class="w-7 h-7" />
          </div>
          <div>
            <h3 class="text-sm text-gray-600">{{ card.label }}</h3>
            <p class="text-3xl font-extrabold" :class="card.textColor">
              {{ card.value }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart -->
    <div class="bg-white p-6 rounded-2xl shadow-lg animate-slideUp">
      <h2 class="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
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
} from '@heroicons/vue/24/solid'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// Chart wrapper
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
            grid: { color: '#f3f4f6' },
            ticks: { color: '#6b7280' },
          },
          x: {
            grid: { display: false },
            ticks: { color: '#6b7280' },
          },
        },
      },
    }
  },
}

// Stats
const stats = ref({
  rooms: 0,
  reservations: 0,
  approved: 0,
  rejected: 0,
})

// Cards config
const cards = ref([
  {
    label: 'Total Rooms',
    value: stats.value.rooms,
    icon: BuildingOfficeIcon,
    gradient: 'from-indigo-50 to-indigo-100',
    iconBg: 'bg-indigo-400',
    textColor: 'text-indigo-600',
  },
  {
    label: 'Total Reservations',
    value: stats.value.reservations,
    icon: CalendarDaysIcon,
    gradient: 'from-sky-50 to-sky-100',
    iconBg: 'bg-sky-400',
    textColor: 'text-sky-600',
  },
  {
    label: 'Approved',
    value: stats.value.approved,
    icon: CheckCircleIcon,
    gradient: 'from-emerald-50 to-emerald-100',
    iconBg: 'bg-emerald-400',
    textColor: 'text-emerald-600',
  },
  {
    label: 'Rejected',
    value: stats.value.rejected,
    icon: XCircleIcon,
    gradient: 'from-rose-50 to-rose-100',
    iconBg: 'bg-rose-400',
    textColor: 'text-rose-600',
  },
])

// Chart data
const chartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Reservations',
      data: [],
      backgroundColor: 'rgba(139, 92, 246, 0.7)', // soft violet
      borderRadius: 8,
    },
  ],
})

onMounted(async () => {
  try {
    const res = await api.get('/dashboard/stats')

    stats.value.rooms = res.data.rooms
    stats.value.reservations = res.data.reservations
    stats.value.approved = res.data.approved
    stats.value.rejected = res.data.rejected

    // update card values
    cards.value[0].value = stats.value.rooms
    cards.value[1].value = stats.value.reservations
    cards.value[2].value = stats.value.approved
    cards.value[3].value = stats.value.rejected

    // update chart
    chartData.value.labels = res.data.chart.labels
    chartData.value.datasets[0].data = res.data.chart.data
  } catch (err) {
    console.error('Error loading dashboard stats:', err)
  }
})
</script>

<style scoped>
/* Animasi lembut */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.8s ease-in-out;
}
.animate-slideUp {
  animation: slideUp 1s ease-in-out;
}
</style>
