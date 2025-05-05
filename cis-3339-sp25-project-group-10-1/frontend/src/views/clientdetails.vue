<!-- This view allows a user to view/update a specific client's information. -->
<template>
  <!-- [Template remains unchanged from original] -->
  <!-- Paste your original template content here -->
</template>

<script setup>
// ✅ Composition API conversion with full migration
// 🔁 Converted from Options API: data(), methods, mounted(), validations()

import { ref, reactive, computed, onMounted } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, email, numeric, minLength, maxLength } from '@vuelidate/validators'
import VueMultiselect from 'vue-multiselect'
import { useLoggedInUserStore } from '../store/loggedInUser'
import {
  getClientById,
  getClientEvents,
  getNonClientEvents,
  registerAttendee,
  deregisterAttendee,
  updateClient,
  deleteClientbyId
} from '../api/api'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

// Stores & router
const user = useLoggedInUserStore()
const route = useRoute()
const router = useRouter()
const toast = useToast()

// Reactive state
const client = reactive({
  firstName: null,
  middleName: null,
  lastName: null,
  email: null,
  phoneNumber: {
    primary: null,
    alternate: null
  },
  address: {
    line1: null,
    line2: null,
    city: null,
    county: null,
    zip: null
  }
})

const eventsFiltered = ref([])
const eventsSelected = ref([])
const clientEvents = ref([])
const hoverId = ref(null)

// Vuelidate rules
const rules = computed(() => ({
  client: {
    firstName: { required },
    lastName: { required },
    email: { required, email },
    phoneNumber: {
      primary: {
        required,
        numeric,
        minLength: minLength(10),
        maxLength: maxLength(10)
      }
    },
    address: {
      city: { required }
    }
  }
}))

const v$ = useVuelidate(rules, { client })

// Fetch client data
onMounted(async () => {
  try {
    const [clientRes, eventsRes, nonClientEventsRes] = await Promise.all([
      getClientById(route.params.id),
      getClientEvents(route.params.id),
      getNonClientEvents(route.params.id)
    ])

    Object.assign(client, clientRes)
    clientEvents.value = eventsRes
    eventsFiltered.value = nonClientEventsRes
  } catch (error) {
    toast.error('Error loading data: ' + error)
  }
})

// Format date
const formatDate = (date) => {
  const iso = new Date(date)
  return `${String(iso.getUTCMonth() + 1).padStart(2, '0')}/${String(iso.getUTCDate()).padStart(2, '0')}/${iso.getUTCFullYear()}`
}

// Display service name + date
const nameWithDate = ({ name, date }) => {
  return `${name} (${formatDate(date)})`
}

// Remove client from event
const removeClientFromEvent = async (clientId, eventId) => {
  try {
    await deregisterAttendee(eventId, clientId)
    toast.success('Client removed from event')
    clientEvents.value = await getClientEvents(route.params.id)
    eventsFiltered.value = await getNonClientEvents(route.params.id)
  } catch (error) {
    toast.error(error)
  }
}

// Add client to selected events
const addClientToEvent = async () => {
  try {
    const clientId = client._id
    const selectedIds = eventsSelected.value.map((e) => e._id)
    await Promise.all(selectedIds.map(eventId => registerAttendee(eventId, clientId)))
    clientEvents.value = await getClientEvents(route.params.id)
    eventsFiltered.value = await getNonClientEvents(route.params.id)
    eventsSelected.value = []
  } catch (error) {
    toast.error(error)
  }
}

// Submit client update
const submitUpdateClient = async () => {
  await v$.value.$validate()
  if (v$.value.$error) return

  try {
    const res = await updateClient(route.params.id, client)
    toast.success(res)
    router.push('/findclient')
  } catch (error) {
    toast.error(error)
  }
}

// Delete client
const submitDeleteClient = async () => {
  try {
    const res = await deleteClientbyId(route.params.id)
    toast.success(res)
    router.push('/findclient')
  } catch (error) {
    toast.error(error)
  }
}
</script>

<!-- Style for multiselect -->
<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style scoped>
.remove-btn-wrapper {
  display: inline-block;
  position: relative;
}
.remove-btn:hover {
  color: black;
}
</style>


