<!-- This view allows a user to create a new service. -->
<template>
  <main>
    <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">
      Create Service
    </h1>

    <div class="px-10 py-20">
      <form @submit.prevent="handleSubmitForm">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <h2 class="text-2xl font-bold">Service Details</h2>

          <!-- Service Name -->
          <div class="flex flex-col col-span-2">
            <label class="block">
              <span class="text-gray-700">Service Name</span>
              <span style="color: #ff0000">*</span>
              <input
                type="text"
                v-model="service.name"
                class="w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300 focus:ring-opacity-50"
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
                class="w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300 focus:ring-opacity-50"
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
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300 focus:ring-opacity-50"
              ></textarea>
            </label>
          </div>
        </div>

        <!-- Submit button -->
        <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <div></div>
          <div class="flex justify-between mr-20">
            <button class="bg-red-700 text-white rounded" type="submit">
              Add New Service
            </button>
          </div>
        </div>
      </form>
    </div>
  </main>
</template>

<script setup>
// ✅ Composition API + Vuelidate for service form

import { reactive, computed } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { createService } from '../api/api'

const router = useRouter()
const toast = useToast()

// Reactive form data
const service = reactive({
  name: '',
  status: 'Active',
  description: ''
})

// Vuelidate validation rules
const rules = computed(() => ({
  service: {
    name: { required }
  }
}))

const v$ = useVuelidate(rules, { service })

// Submit handler
const handleSubmitForm = async () => {
  await v$.value.$validate()
  if (v$.value.$error) return

  try {
    const res = await createService(service)
    toast.success(res)
    router.push('/findservice')
  } catch (error) {
    toast.error('Error creating service: ' + error)
  }
}
</script>

