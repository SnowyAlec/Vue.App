<!-- This view allows a user to update or delete a service. -->
<template>
  <main>
    <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">
      Service Details
    </h1>

    <div class="px-10 py-20">
      <form @submit.prevent="handleUpdateService">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <h2 class="text-2xl font-bold">Edit Service</h2>

          <!-- Name -->
          <div class="flex flex-col col-span-2">
            <label class="block">
              <span class="text-gray-700">Service Name</span>
              <span style="color: #ff0000">*</span>
              <input
                type="text"
                v-model="service.name"
                class="w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </label>
            <span v-if="v$.service.name.$error" class="text-red-500">
              Service Name is required
            </span>
          </div>

          <!-- Status -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Status</span>
              <select
                v-model="service.status"
                class="w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>
          </div>

          <!-- Description -->
          <div class="flex flex-col col-span-3">
            <label class="block">
              <span class="text-gray-700">Description</span>
              <textarea
                v-model="service.description"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              ></textarea>
            </label>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mt-10 gap-x-6">
          <div></div>

          <!-- Update -->
          <div class="flex justify-between mr-20">
            <button class="bg-green-700 text-white rounded" type="submit">
              Update Service
            </button>
          </div>

          <!-- Delete -->
          <div class="flex justify-between mr-20">
            <button class="bg-red-700 text-white rounded" type="button" @click="handleDeleteService">
              Delete Service
            </button>
          </div>

          <!-- Go Back -->
          <div class="flex justify-between mr-20">
            <button class="border border-red-700 bg-white text-red-700 rounded" type="button" @click="router.back()">
              Go Back
            </button>
          </div>
        </div>
      </form>
    </div>
  </main>
</template>

<script setup>
// ✅ Composition API for viewing and updating a service

import { reactive, computed, onMounted } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import {
  getServiceById,
  updateService,
  deleteService
} from '../api/api'

const router = useRouter()
const route = useRoute()
const toast = useToast()

// Reactive service data
const service = reactive({
  name: '',
  status: 'Active',
  description: ''
})

// Vuelidate rules
const rules = computed(() => ({
  service: {
    name: { required }
  }
}))

const v$ = useVuelidate(rules, { service })

// Load service info
onMounted(async () => {
  try {
    const response = await getServiceById(route.params.id)
    Object.assign(service, response)
  } catch (error) {
    toast.error('Error loading service: ' + error)
  }
})

// Update service
const handleUpdateService = async () => {
  await v$.value.$validate()
  if (v$.value.$error) return

  try {
    const res = await updateService(route.params.id, service)
    toast.success(res)
    router.push('/findservice')
  } catch (error) {
    toast.error('Error updating service: ' + error)
  }
}

// Delete service
const handleDeleteService = async () => {
  try {
    const res = await deleteService(route.params.id)
    toast.success(res)
    router.push('/findservice')
  } catch (error) {
    toast.error('Error deleting service: ' + error)
  }
}
</script>
