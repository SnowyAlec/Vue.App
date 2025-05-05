<!-- This view allows a user to search for events and view their details. -->
<template>
  <main>
    <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">
      Find Event
    </h1>

    <div class="p-10">
      <!-- Search bar -->
      <div class="mb-6 flex justify-center">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Search by event name"
          class="w-1/2 rounded-md border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300 focus:ring-opacity-50"
        />
      </div>

      <!-- Events Table -->
      <div v-if="filteredEvents.length">
        <table class="min-w-full shadow-md rounded">
          <thead class="bg-gray-50 text-xl">
            <tr>
              <th class="p-4 text-left">Event Name</th>
              <th class="p-4 text-left">Date</th>
              <th class="p-4 text-left">City</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-300">
            <tr
              v-for="event in filteredEvents"
              :key="event._id"
              class="cursor-pointer hover:bg-gray-100"
              @click="goToEventDetails(event._id)"
            >
              <td class="p-2">{{ event.name }}</td>
              <td class="p-2">{{ formatDate(event.date) }}</td>
              <td class="p-2">{{ event.address.city }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- No results -->
      <div v-else class="text-center text-gray-500 text-xl mt-10">
        No events found.
      </div>
    </div>
  </main>
</template>

<script setup>
// ✅ Composition API version of findevents.vue

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { getAllEvents } from '../api/api'

const router = useRouter()
const toast = useToast()

const searchTerm = ref('')
const events = ref([])

// Filter events by name
const filteredEvents = computed(() => {
  const term = searchTerm.value.toLowerCase()
  return events.value.filter((event) =>
    event.name.toLowerCase().includes(term)
  )
})

// Fetch events on mount
onMounted(async () => {
  try {
    events.value = await getAllEvents()
  } catch (error) {
    toast.error('Error loading events: ' + error)
  }
})

// Navigate to event details
const goToEventDetails = (id) => {
  router.push({ name: 'eventdetails', params: { id } })
}

// Format event date
const formatDate = (date) => {
  const iso = new Date(date)
  const month = String(iso.getUTCMonth() + 1).padStart(2, '0')
  const day = String(iso.getUTCDate()).padStart(2, '0')
  const year = iso.getUTCFullYear()
  return `${month}/${day}/${year}`
}
</script>
