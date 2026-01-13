<template>
  <div>
    <h1>Produkter</h1>

    <ul>
      <li v-for="p in products" :key="p.id">
        {{ p.name }} – {{ p.quantity }} st
      </li>
    </ul>

    <p v-if="error" style="color:red">{{ error }}</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getProducts } from '../services/api'

const products = ref([])
const error = ref('')

onMounted(async () => {
  try {
    products.value = await getProducts()
  } catch (err) {
    error.value = err.message
  }
})
</script>
