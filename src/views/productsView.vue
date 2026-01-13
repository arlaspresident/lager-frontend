<template>
  <div>
    <h1>Produkter</h1>
    <button @click="onLogout">Logga ut</button>

    <h2>Skapa produkt</h2>

<form @submit.prevent="onCreate">
  <div>
    <label>SKU</label>
    <input v-model="form.sku" required />
  </div>

  <div>
    <label>Namn</label>
    <input v-model="form.name" required />
  </div>

  <div>
    <label>Beskrivning</label>
    <input v-model="form.description" />
  </div>

  <div>
    <label>Plats</label>
    <input v-model="form.location" />
  </div>

  <div>
    <label>Pris</label>
    <input v-model.number="form.price" type="number" />
  </div>

  <div>
    <label>Antal</label>
    <input v-model.number="form.quantity" type="number" min="0" />
  </div>

  <button type="submit">Skapa</button>
</form>


    <ul>
      <li v-for="p in products" :key="p.id">
        {{ p.name }} – {{ p.quantity }} st
        <button @click="changeStock(p.id, -1)">-</button>
        <button @click="changeStock(p.id, 1)">+</button>
        <button @click="onDelete(p.id)" style="color: red">Radera</button>
      </li>
    </ul>

    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getProducts, updateStock, logout, createProduct, deleteProduct } from '../services/api'

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


const form = ref({
  sku: '',
  name: '',
  description: '',
  location: '',
  price: null,
  quantity: 0
})
async function onCreate() {
  error.value = ''
  try {
    const created = await createProduct({
      sku: form.value.sku,
      name: form.value.name,
      description: form.value.description || null,
      location: form.value.location || null,
      price: form.value.price === '' ? null : form.value.price,
      quantity: form.value.quantity ?? 0,
      category_id: null,
      is_active: 1
    })

    //lägg längst upp i listan
    products.value.unshift(created)

    //reset form
    form.value = { sku: '', name: '', description: '', location: '', price: null, quantity: 0 }
  } catch (err) {
    error.value = err.message
  }
}


async function onDelete(id) {
  //bekräftelse
  if (!confirm('Är du säker? Denna åtgärd kan inte ångras.')) {
    return
  }

  error.value = ''
  try {
    await deleteProduct(id)
    //ta bort från listan
    products.value = products.value.filter(p => p.id !== id)
  } catch (err) {
    error.value = err.message
  }
}

</script>
