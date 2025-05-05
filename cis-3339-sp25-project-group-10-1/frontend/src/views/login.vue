<template>
  <div>
    <!--Header-->
    <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Welcome</h1>
    <!--Form-->
    <form @submit.prevent="handleLogin" novalidate="true">
      <div class="flex justify-center mt-10">
        <label>
          <span class="text-gray-700">Username</span>
          <span style="color: #ff0000">*</span>
          <input
            type="text"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder
            v-model="username"
          />
        </label>
      </div>
      <div class="flex justify-center mt-10">
        <label>
          <span class="text-gray-700">Password</span>
          <span style="color: #ff0000">*</span>
          <input
            type="password"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder
            v-model="password"
          />
        </label>
      </div>
      <div class="flex justify-center mt-10">
        <button
          class="px-10 py-3 bg-red-700 text-white rounded-lg hover:bg-red-900"
          type="submit"
        >
          Login
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>

// Migrated from Options API to Composition API
// Replaced data() with ref() variables and methods with functions inside setup()

import { ref } from 'vue'
import { useLoggedInUserStore } from '../store/loggedinuser'  //  correct store

const store = useLoggedInUserStore()
const username = ref('')
const password = ref('')


const handleLogin = () => {
  store.login(username.value, password.value)
}
</script>
