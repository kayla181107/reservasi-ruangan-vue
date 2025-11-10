<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-semibold text-gray-700">Dashboard</h1>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div
        v-for="(card, i) in cards"
        :key="i"
        class="bg-white border border-cyan-800 rounded-xl shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition transform hover:-translate-y-1 duration-300"
      >
        <div>
          <h3 class="text-black font-bold text-xl">
            {{ card.label }}
          </h3>

          <p class="text-3xl font-bold mt-2 text-gray-900">
            {{ card.value }}
          </p>

          <p class="text-sm text-gray-500 mt-1">
            <span v-if="card.label === 'Daftar Reservasi'">
              <span v-if="stats.reservationChange > 0">
                +{{ stats.reservationChange }}% dari bulan terakhir
              </span>
              <span v-else-if="stats.reservationChange < 0">
                {{ stats.reservationChange }}% dari bulan terakhir
              </span>
              <span v-else>
                - belum bertambah
              </span>
            </span>

            <span v-else-if="card.label === 'Ruangan'">
              <span v-if="stats.roomChange > 0">
                +{{ stats.roomChange }}% dari bulan terakhir
              </span>
              <span v-else-if="stats.roomChange < 0">
                {{ stats.roomChange }}% dari bulan terakhir
              </span>
              <span v-else>
                - belum bertambah
              </span>
            </span>

            <span v-else-if="card.label === 'Jadwal Tetap'">
              <span v-if="stats.scheduleChange > 0">
                +{{ stats.scheduleChange }}% dari bulan terakhir
              </span>
              <span v-else-if="stats.scheduleChange < 0">
                {{ stats.scheduleChange }}% dari bulan terakhir
              </span>
              <span v-else>
                - belum ada yang terjadwal
              </span>
            </span>

            <span v-else-if="card.label === 'User'">
              <span v-if="stats.userChange > 0">
                +{{ stats.userChange }}% dari bulan terakhir
              </span>
              <span v-else-if="stats.userChange < 0">
                {{ stats.userChange }}% dari bulan terakhir
              </span>
              <span v-else>
                - belum bertambah
              </span>
            </span>
          </p>
        </div>
      </div>
    </div>

    <div
      class="bg-white border border-gray-200 rounded-xl shadow p-6 mb-10 transition-all duration-500 hover:shadow-lg"
    >
      <h2 class="text-2xl font-extrabold mb-4" style="color: #006989;">
        Statistik Reservasi Bulanan
      </h2>

      <div v-if="loadingChart" class="text-gray-500 text-sm animate-pulse">
        Memuat grafik...
      </div>

      <div v-else class="h-[350px]">
        <BarChart
          v-if="chartData && chartData.datasets && chartData.datasets.length > 0"
          :chart-data="chartData"
        />
        <div v-else class="text-gray-400 italic text-sm">
          Belum ada data statistik untuk bulan ini.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
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

const BarChart = {
  props: ['chartData'],
  components: { Bar },
  template: `
    <div style="height: 350px;">
      <Bar :data="chartData" :options="options" />
    </div>
  `,
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
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

const stats = ref({
  reservations: 0,
  rooms: 0,
  fixedSchedules: 0,
  users: 0,
  reservationChange: 0,
  roomChange: 0,
  scheduleChange: 0,
  userChange: 0,
  chart: { labels: [], data: [] },
})

const cards = ref([
  { label: 'Daftar Reservasi', value: 0, desc: '+% dari bulan terakhir' },
  { label: 'Ruangan', value: 0, desc: '- belum bertambah' },
  { label: 'Jadwal Tetap', value: 0, desc: '- belum ada yang terjadwal' },
  { label: 'User', value: 0, desc: '- belum bertambah' },
])

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Reservasi',
      data: [],
      backgroundColor: '#00728A',
      borderRadius: 8,
    },
  ],
})

const loadingChart = ref(true)

onMounted(async () => {
  try {
    const res = await api.get('/dashboard/stats')
    stats.value = res.data

    cards.value[0].value = stats.value.reservations || 0
    cards.value[1].value = stats.value.rooms || 0
    cards.value[2].value = stats.value.fixedSchedules || 0
    cards.value[3].value = stats.value.users || 0

    if (res.data.chart) {
      await nextTick()
      chartData.value = {
        labels: res.data.chart.labels || [],
        datasets: [
          {
            label: 'Reservasi',
            data: res.data.chart.data || [],
            backgroundColor: '#00728A',
            borderRadius: 8,
          },
        ],
      }
    }
  } catch (err) {
    console.error('❌ Gagal memuat data statistik:', err)
  } finally {
    loadingChart.value = false
  }
})
</script>

<style scoped>
body {
  background-color: #f9fafb;
}
</style>
