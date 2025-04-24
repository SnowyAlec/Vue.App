<template>
  <form v-cloak>
    <h1>Facilities</h1>

    <ul>
      <li
        v-for="facility in facilities"
        :key="facility.name"
        @click="toggleActive(facility)"
        :class="{ active: facility.active }"
      >
        {{ facility.name }} <span>{{ formatCurrency(facility.price) }}</span>
      </li>
    </ul>

    <hr />

    <div class="total">
      <span>Total:</span>
      <span>{{ formatCurrency(total()) }}</span>
    </div>
  </form>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      facilities: [
        { name: "Ballroom", price: 5000, active: false }, //making a simple code that label price and keeping it false by default
        { name: "Backyard", price: 400, active: false },
        { name: "Wellness Area", price: 250, active: false },
        { name: "Restaurant", price: 220, active: false }
      ]
    };
  },
  methods: {
    toggleActive(facility) {
      facility.active = !facility.active;
    },
    total() {
      return this.facilities
        .filter(f => f.active)
        .reduce((sum, f) => sum + f.price, 0);
    },
    formatCurrency(value) {
      return "$" + value.toFixed(2);
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');

form {
  font-family: 'Great Vibes', cursive; /*changing font */
  max-width: 320px;
  margin: 50px auto;
  background-color: #9933FF;
  padding: 30px 20px;
  border-radius: 15px;
  color: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
/* making it centered */
h1 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 25px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
/* changes bbackground of color of the boxes and color the letter with white */
li {
  background-color: #696969;
  margin-bottom: 10px;
  padding: 10px 16px;
  font-weight: bold;
  font-family: 'Arial', sans-serif;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease-in-out;
  color: white;
}
/* boxes turn lime green */
li.active {
  background-color: #66FF00;
  color: white;
  font-weight: bold;
}

hr {
  border: none;
  border-top: 1px solid white;
  margin: 20px 0;
}

.total {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 1.1rem;
  font-family: 'Arial', sans-serif;
}
</style>
