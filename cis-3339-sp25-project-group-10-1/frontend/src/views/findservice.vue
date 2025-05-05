<!-- This view allows a user to search and view services. -->
<template>
  <main>
    <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">
      Find Service
    </h1>

    <div class="p-10">
      <!-- Search bar -->
      <div class="mb-6 flex justify-center">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Search by service name"
          class="w-1/2 rounded-md border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300 focus:ring-opacity-50"
        />
      </div>

      <!-- Service Table -->
      <div v-if="filteredServices.length">
        <table class="min-w-full shadow-md rounded">
          <thead class="bg-gray-50 text-xl">
            <tr>
              <th class="p-4 text-left">Service Name</th>
              <th class="p-4 text-left">Status</th>
              <th class="p-4 text-left">Description</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-300">
            <tr
              v-for="service in filteredServices"
              :key="service._id"
              class="cursor-pointer hover:bg-gray-100"
              @click="goToServiceDetails(service._id)"
            >
              <td class="p-2">{{ service.name }}</td>
              <td class="p-2">{{ service.status }}</td>
              <td class="p-2">{{ service.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- No results -->
      <div v-else class="text-center text-gray-500 text-xl mt-10">
        No services found.
      </div>
    </div>
  </main>
</template>

<script setup>
// ✅ Composition API version of findservice.vue

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { getAllServices } from '../api/api'

const router = useRouter()
const toast = useToast()

const searchTerm = ref('')
const services = ref([])

// Filter services by name
const filteredServices = computed(() => {
  const term = searchTerm.value.toLowerCase()
  return services.value.filter((service) =>
    service.name.toLowerCase().includes(term)
  )
})

// Load services on mount
onMounted(async () => {
  try {
    services.value = await getAllServices()
  } catch (error) {
    toast.error('Error loading services: ' + error)
  }
})

// Navigate to service details
const goToServiceDetails = (id) => {
  router.push({ name: 'servicedetails', params: { id } })
}
</script>
