<template>
  <div>
    <canvas class="p-10" ref="attendanceChart"></canvas>
  </div>
</template>

<script setup>
// Migrated from Options API to Composition API
// Replaced props, mounted hook, and refs accordingly

import { Chart, registerables } from 'chart.js'
import { Colors } from 'chart.js'
import { ref, onMounted } from 'vue'

Chart.register(...registerables)
Chart.register(Colors)

// Define props using defineProps in Composition API
const props = defineProps({
  label: { type: Array },
  chartData: { type: Array }
})

// Ref for canvas element
const attendanceChart = ref(null)

onMounted(async () => {
  // Initialize Chart.js with props data
  await new Chart(attendanceChart.value, {
    type: 'bar',
    data: {
      labels: props.label,
      datasets: [
        {
          borderWidth: 1,
          data: props.chartData
        }
      ]
    },
    options: {
      scales: {
        y: {
          ticks: { stepSize: 1 }
        },
        x: {
          gridLines: { display: false }
        }
      },
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Attendance Chart' }
      }
    }
  })
})
</script>
