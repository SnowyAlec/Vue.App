<template>
  <div class="w-1/2">
    <canvas class="p-10" ref="zipChart"></canvas>
  </div>
</template>

<script setup>
// Migrated from Options API to Composition API
// Replaced props, mounted hook, and refs accordingly

import { Chart, registerables } from 'chart.js'
import { ref, onMounted } from 'vue'

Chart.register(...registerables)

// Define props using defineProps in Composition API
const props = defineProps({
  label: { type: Array },
  chartData: { type: Array }
})

// Ref for canvas element
const zipChart = ref(null)

onMounted(async () => {
  // Initialize Chart.js with props data
  await new Chart(zipChart.value, {
    type: 'doughnut',
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
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Clients by Zip Code' }
      },
      responsive: true,
      maintainAspectRatio: true
    }
  })
})
</script>
