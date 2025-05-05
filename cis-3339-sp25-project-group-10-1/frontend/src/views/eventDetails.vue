<!-- This component allows a user to update a specific event's information. -->
<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">
        Event Details
      </h1>
    </div>

    <div class="px-10 py-20">
      <!-- Event Form -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        <h2 class="text-2xl font-bold">Event Details</h2>

        <!-- Event Name -->
        <div class="flex flex-col">
          <label class="block">
            <span class="text-gray-700">Event Name</span>
            <span style="color: #ff0000">*</span>
            <input type="text" v-model="event.name"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            <span v-if="v$.event.name.$error" class="text-red-500">
              Event Name is required
            </span>
          </label>
        </div>

        <!-- Date -->
        <div class="flex flex-col">
          <label class="block">
            <span class="text-gray-700">Date</span>
            <span style="color: #ff0000">*</span>
            <input type="date" v-model="event.date"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            <span v-if="v$.event.date.$error" class="text-red-500">
              <span v-if="v$.event.date.required.$invalid">Event Date is required</span>
              <span v-else-if="v$.event.date.validDate.$invalid">Event Date must be a valid date</span>
            </span>
          </label>
        </div>

        <div></div>
        <div></div>

        <!-- Description -->
        <div class="flex flex-col">
          <label class="block">
            <span class="text-gray-700">Description</span>
            <textarea v-model="event.description" rows="2"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
          </label>
        </div>
      </div>

      <!-- Services -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 mt-10">
        <h2 class="text-2xl font-bold">Services Offered at Event</h2>
        <div class="flex flex-col grid-cols-3">
          <div>
            <ul v-if="services.length" class="space-y-2">
              <li v-for="service in services" :key="service._id"
                class="rounded-lg border border-gray-300 p-2 hover:bg-gray-100 transition-colors relative">
                <label class="block w-full h-full">
                  <input type="checkbox" :value="service._id" v-model="event.services"
                    :disabled="service.status === 'Inactive'"
                    class="rounded border-gray-300 disabled:opacity-50 text-indigo-600 shadow-sm focus:ring" />
                  <span class="font-medium">{{ service.name }}</span>
                </label>
              </li>
            </ul>
            <p v-else class="text-gray-600">No Active Services Available</p>
          </div>
        </div>
      </div>

      <!-- Address -->
      <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        <h2 class="text-2xl font-bold">Address</h2>

        <div class="flex flex-col">
          <label class="block">
            <span class="text-gray-700">Address Line 1</span>
            <input type="text" v-model="event.address.line1"
              class="w-full rounded-md border-gray-300 shadow-sm focus:ring" />
          </label>
        </div>

        <div class="flex flex-col">
          <label class="block">
            <span class="text-gray-700">Address Line 2</span>
            <input type="text" v-model="event.address.line2"
              class="w-full rounded-md border-gray-300 shadow-sm focus:ring" />
          </label>
        </div>

        <div class="flex flex-col">
          <label class="block">
            <span class="text-gray-700">City</span>
            <input type="text" v-model="event.address.city"
              class="w-full rounded-md border-gray-300 shadow-sm focus:ring" />
          </label>
        </div>

        <div></div>

        <div class="flex flex-col">
          <label class="block">
            <span class="text-gray-700">County</span>
            <input type="text" v-model="event.address.county"
              class="w-full rounded-md border-gray-300 shadow-sm focus:ring" />
          </label>
        </div>

        <div class="flex flex-col">
          <label class="block">
            <span class="text-gray-700">Zip Code</span>
            <input type="text" v-model="event.address.zip"
              class="w-full rounded-md border-gray-300 shadow-sm focus:ring" />
          </label>
        </div>
      </div>

      <!-- Submit Buttons -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        <div></div>

        <div class="flex justify-between mt-10 mr-20">
          <button @click="submitEventUpdate" type="submit"
            class="bg-green-700 text-white rounded disabled:opacity-50"
            :disabled="user.role === 'viewer'">Update Event</button>
        </div>

        <div class="flex justify-between mt-10 mr-20">
          <button @click="submitDeleteEvent" type="submit"
            class="bg-red-700 text-white rounded disabled:opacity-50"
            :disabled="user.role === 'viewer'">Delete Event</button>
        </div>

        <div class="flex justify-between mt-10 mr-20">
          <button type="reset" class="border border-red-700 bg-white text-red-700 rounded" @click="router.back()">
            Go back
          </button>
        </div>
      </div>

      <!-- Attendees Table -->
      <hr class="mt-10 mb-10" />

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        <div>
          <h2 class="text-2xl font-bold">List of Attendees</h2>
          <h3 class="italic">Click table row to view client details</h3>
        </div>

        <div class="flex flex-col col-span-2">
          <table class="min-w-full shadow-md rounded">
            <thead class="bg-gray-50 text-xl">
              <tr>
                <th class="p-4 text-left">Name</th>
                <th class="p-4 text-left">City</th>
                <th class="p-4 text-left">Phone Number</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-300">
              <tr v-for="client in clients" :key="client._id"
                @click="router.push({ name: 'clientdetails', params: { id: client._id } })"
                class="cursor-pointer" :class="{ 'hoverRow': hoverId === client._id }"
                @mouseenter="hoverId = client._id" @mouseleave="hoverId = null">
                <td class="p-2 text-left">{{ client.firstName + ' ' + client.lastName }}</td>
                <td class="p-2 text-left">{{ client.address.city }}</td>
                <td class="p-2 text-left">{{ client.phoneNumber.primary }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
// ✅ Composition API version of eventDetails.vue

import { ref, reactive, computed, onMounted } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useRoute, useRouter } from 'vue-router'
import { useLogged
