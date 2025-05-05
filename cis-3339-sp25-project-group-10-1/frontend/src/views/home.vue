<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">
        Dashboard
      </h1>
      <br />
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        <div class="ml-10"></div>
        <div class="flex flex-col col-span-2">
          <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">
              Events Attendance
          </h1>

          <div v-if="!recentEvents.length" class="flex justify-center mt-10">No events found.</div>
          <table v-if="recentEvents.length" class="min-w-full shadow-md rounded">
            <thead class="bg-gray-50 text-xl">
              <tr class="p-4 text-left">
                <th class="p-4 text-left">Event Name</th>
                <th class="p-4 text-left">Event Date</th>
                <th class="p-4 text-left">Number of Attendees</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-300"> 
              <tr
                v-for="event in recentEvents"
                :key="event._id"
              >
                <td class="p-2 text-left">{{ event.name }}</td>
                <td class="p-2 text-left">{{ formatDate(event.date) }}</td>
                <td class="p-2 text-left">{{ event.attendees.length }}</td>
              </tr>
            </tbody>
          </table>
          
          <div v-if="recentEvents.length">
            <AttendanceChart
              v-if="!loading && !error"
              :label="labels"
              :chart-data="chartData"
            />

            <div class="mt-40" v-if="loading">
              <p class="text-6xl font-bold text-center text-gray-500 animate-pulse">
                Loading...
              </p>
            </div>

            <div class="mt-12 bg-red-50" v-if="error">
              <h3 class="px-4 py-1 text-4xl font-bold text-white bg-red-800">
                {{ error.title }}
              </h3>
              <p class="p-4 text-lg font-bold text-red-900">
                {{ error.message }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Clients by Zip -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        <div class="ml-10"></div>
        <div class="flex flex-col col-span-2">
          <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">
              Clients by Zip Code
          </h1>

          <div v-if="!zips.length" class="flex justify-center mt-10">No clients found.</div>
          <table v-if="zips.length" class="min-w-full shadow-md rounded">
            <thead class="bg-gray-50 text-xl">
              <tr class="p-4 text-left">
                <th class="p-4 text-left">Zip Number</th>
                <th class="p-4 text-left">Client Count</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-300">
              <tr v-for="zip in zips" :key="zip._id">
                <td class="p-2 text-left">{{ zip._id }}</td>
                <td class="p-2 text-left">{{ zip.count }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="zips.length" class="flex justify-center mt-10">
            <ZipChart
              v-if="!zipLoading && !zipError"
              :label="zipLabels"
              :chart-data="zipChartData"
            />

            <div class="mt-40" v-if="zipLoading">
              <p class="text-6xl font-bold text-center text-gray-500 animate-pulse">
                Loading...
              </p>
            </div>

            <div class="mt-12 bg-red-50" v-if="zipError">
              <h3 class="px-4 py-1 text-4xl font-bold text-white bg-red-800">
                {{ zipError.title }}
              </h3>
              <p class="p-4 text-lg font-bold text-red-900">
                {{ zipError.message }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
// Migrated from Options API to Composition API
// Replaced data(), methods, and mounted() with ref(), functions, and onMounted()

import AttendanceChart from '../components/barChart.vue'
import ZipChart from '../components/donutZipChart.vue'
import { getAttendance, getClientsByZipCode } from '../api/api'
import { ref, onMounted } from 'vue'

// Refs for data
const recentEvents = ref([])
const zips = ref([])
const labels = ref([])
const chartData = ref([])
const zipLabels = ref([])
const zipChartData = ref([])
const loading = ref(false)
const error = ref(null)
const zipLoading = ref(false)
const zipError = ref(null)

// Fetch attendance data
const getAttendanceData = async () => {
  try {
    error.value = null
    loading.value = true
    const attendance = await getAttendance()
    recentEvents.value = attendance
    labels.value = attendance.map(item => `${item.name} (${formatDate(item.date)})`)
    chartData.value = attendance.map(item => item.attendees.length)
  } catch (err) {
    handleError(err, 'attendance')
  }
  loading.value = false
}

// Fetch clients by zip code data
const getZipData = async () => {
  try {
    zipError.value = null
    zipLoading.value = true
    const zipdata = await getClientsByZipCode()
    zips.value = zipdata
    zipLabels.value = zipdata.map(item => item._id)
    zipChartData.value = zipdata.map(item => item.count)
  } catch (err) {
    handleError(err, 'zip')
  }
  zipLoading.value = false
}

// Error handler function
const handleError = (err, type) => {
  const errObj = {
    title: '',
    message: err.message
  }
  if (err.response) {
    errObj.title = 'Server Response'
  } else if (err.request) {
    errObj.title = 'Unable to Reach Server'
  } else {
    errObj.title = 'Application Error'
  }
  if (type === 'attendance') error.value = errObj
  if (type === 'zip') zipError.value = errObj
}

// Format date
const formatDate = (date) => {
  const isoDate = new Date(date)
  const year = isoDate.getUTCFullYear()
  const month = String(isoDate.getUTCMonth() + 1).padStart(2, '0')
  const day = String(isoDate.getUTCDate()).padStart(2, '0')
  return `${month}/${day}/${year}`
}

// onMounted hook to load data
onMounted(() => {
  getAttendanceData()
  getZipData()
})
</script>
