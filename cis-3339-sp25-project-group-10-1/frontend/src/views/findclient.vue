<!-- This view allows a user to search for existing clients and view details. -->
<template>
  <main>
    <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">
      Find Client
    </h1>

    <div class="p-10">
      <!-- Search bar -->
      <div class="mb-6 flex justify-center">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Search by first or last name"
          class="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <!-- Client Table -->
      <div v-if="filteredClients.length">
        <table class="min-w-full shadow-md rounded">
          <thead class="bg-gray-50 text-xl">
            <tr>
              <th class="p-4 text-left">First Name</th>
              <th class="p-4 text-left">Last Name</th>
              <th class="p-4 text-left">Phone Number</th>
              <th class="p-4 text-left">City</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-300">
            <tr
              v-for="client in filteredClients"
              :key="client._id"
              class="cursor-pointer hover:bg-gray-100"
              @click="goToClientDetails(client._id)"
            >
              <td class="p-2">{{ client.firstName }}</td>
              <td class="p-2">{{ client.lastName }}</td>
              <td class="p-2">{{ client.phoneNumber.primary }}</td>
              <td class="p-2">{{ client.address.city }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- No results message -->
      <div v-else class="text-center text-gray-500 text-xl mt-10">
        No clients found.
      </div>
    </div>
  </main>
</template>

<script setup>
// ✅ Composition API version of findclient.vue

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { getAllClients } from '../api/api'

const router = useRouter()
const toast = useToast()

const searchTerm = ref('')
const clients = ref([])

// Computed list based on search
const filteredClients = computed(() => {
  const term = searchTerm.value.toLowerCase()
  return clients.value.filter(
    (client) =>
      client.firstName.toLowerCase().includes(term) ||
      client.lastName.toLowerCase().includes(term)
  )
})

// Fetch client data
onMounted(async () => {
  try {
    clients.value = await getAllClients()
  } catch (error) {
    toast.error('Error loading clients: ' + error)
  }
})

// Navigate to details page
const goToClientDetails = (id) => {
  router.push({ name: 'clientdetails', params: { id } })
}
</script>
