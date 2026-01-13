<template>
  <div>
    <h1>Produkter</h1>
    <button @click="onLogout">Logga ut</button>

    <ul>
      <li v-for="p in products" :key="p.id">
        {{ p.name }} – {{ p.quantity }} st
        <button @click="changeStock(p.id, -1)">-</button>
        <button @click="changeStock(p.id, 1)">+</button>
      </li>
    </ul>

    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getProducts, updateStock, logout } from '../services/api'

const products = ref([])
const error = ref('')
const router = useRouter()

onMounted(async () => {
  try {
    products.value = await getProducts()
  } catch (err) {
    error.value = err.message
  }
})

function onLogout() {
  logout()
  router.push('/')
}

async function changeStock(id, delta) {
  error.value = ''
  try {
    const updated = await updateStock(id, delta)
    const idx = products.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      products.value[idx] = { ...products.value[idx], quantity: updated.quantity }
    }
  } catch (err) {
    error.value = err.message
  }
}
</script>
