<template>
  <main class="flex flex-row">
    <div id="_container" class="min-h-screen">
      <header class="w-full">
        <section class="text-center">
          <img class="m-auto" src="@/assets/DanPersona.svg" />
        </section>
        <!--Navigation bar-->
        <nav class="mt-10">
          <ul class="flex flex-col gap-4">
            <li>
              <router-link to="/">
                <span class="material-icons" style="position: relative; top: 6px">dashboard</span>
                Dashboard
              </router-link>
            </li>
            <li v-if="!user.isLoggedIn">
              <router-link to="/login">
                <span class="material-icons" style="position: relative; top: 6px">login</span>
                Login
              </router-link>
            </li>
            <li v-if="user.isLoggedIn" @click.prevent="logout" style="cursor: pointer;">
              <span class="material-icons" style="position: relative; top: 6px">logout</span>
              Logout
            </li>
            <li v-if="user.role === 'editor'">
              <router-link to="/clientform">
                <span class="material-icons" style="position: relative; top: 6px">people</span>
                Client Intake Form
              </router-link>
            </li>
            <li v-if="user.role === 'editor'">
              <router-link to="/eventform">
                <span class="material-icons" style="position: relative; top: 6px">event</span>
                Create Event
              </router-link>
            </li>
            <li v-if="user.role === 'editor'">
              <router-link to="/serviceform">
                <span class="material-icons" style="position: relative; top: 6px">volunteer_activism</span>
                Create Service
              </router-link>
            </li>
            <li v-if="user.isLoggedIn">
              <router-link to="/findclient">
                <span class="material-icons" style="position: relative; top: 6px">search</span>
                Find Client
              </router-link>
            </li>
            <li v-if="user.isLoggedIn">
              <router-link to="/findevents">
                <span class="material-icons" style="position: relative; top: 6px">search</span>
                Find Event
              </router-link>
            </li>
            <li v-if="user.isLoggedIn">
              <router-link to="/findservice">
                <span class="material-icons" style="position: relative; top: 6px">search</span>
                Find Service
              </router-link>
            </li>
          </ul>
        </nav>
      </header>
    </div>

    <div class="grow w-4/5">
      <!--Organization Name Header-->
      <section class="justify-end items-center h-24 flex"
        style="background: linear-gradient(250deg, #c8102e 70%, #efecec 50.6%)">
        <h1 class="mr-20 text-3xl text-white">{{ orgName }}</h1>
      </section>

      <!--Page Content-->
      <div>
        <router-view></router-view>
      </div>
    </div>
  </main>
</template>

<script setup>
// ✅ Composition API implementation

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { getOrgName } from './api/api'
import { useLoggedInUserStore } from './store/loggedInUser'

const router = useRouter()
const toast = useToast()
const user = useLoggedInUserStore()
const orgName = ref('Dataplatform')

onMounted(async () => {
  try {
    orgName.value = await getOrgName()
  } catch (error) {
    toast.error('Failed to load organization name')
  }
})

// Handle logout
const logout = () => {
  try {
    user.logout()
    router.push('/')
  } catch (error) {
    toast.error('Logout error')
  }
}
</script>

<style scoped>
#_container {
  background-color: #c8102e;
  color: white;
  padding: 18px;
}
</style>
