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
      <div>
        <label>Kategori</label>
        <select v-model.number="form.category_id">
          <option :value="null">Ingen kategori</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>
      <button type="submit">Skapa</button>
    </form>

    <!-- edit -->
    <div v-if="editingId !== null">
      <h2>Redigera: {{ editForm.name }}</h2>
      <form @submit.prevent="onUpdate">
        <div>
          <label>SKU</label>
          <input v-model="editForm.sku" required />
        </div>
        <div>
          <label>Namn</label>
          <input v-model="editForm.name" required />
        </div>
        <div>
          <label>Beskrivning</label>
          <input v-model="editForm.description" />
        </div>
        <div>
          <label>Plats</label>
          <input v-model="editForm.location" />
        </div>
        <div>
          <label>Pris</label>
          <input v-model.number="editForm.price" type="number" />
        </div>
        <div>
          <label>Antal</label>
          <input v-model.number="editForm.quantity" type="number" min="0" />
        </div>
        <div>
          <label>Kategori</label>
          <select v-model.number="editForm.category_id">
            <option :value="null">Ingen kategori</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>
        <button type="submit">Spara</button>
        <button type="button" @click="cancelEdit">Avbryt</button>
      </form>
    </div>

    <!-- produktlista -->
    <div v-else>
      <h2>Produkter</h2>
      <ul>
        <li v-for="p in products" :key="p.id">
          {{ p.name }} – {{ p.quantity }} st
          <button @click="changeStock(p.id, -1)">-</button>
          <button @click="changeStock(p.id, 1)">+</button>
          <button @click="startEdit(p)">Redigera</button>
          <button @click="onDelete(p.id)" style="color: red">Radera</button>
        </li>
      </ul>
    </div>

    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  getProducts,
  getCategories,
  updateStock,
  logout,
  createProduct,
  deleteProduct,
  updateProduct
} from '../services/api'

const products = ref([])
const categories = ref([])
const error = ref('')
const router = useRouter()
const editingId = ref(null)
const editForm = ref(null)

const form = ref({
  sku: '',
  name: '',
  description: '',
  location: '',
  price: null,
  quantity: 0,
  category_id: null
})

onMounted(async () => {
  try {
    products.value = await getProducts()
    categories.value = await getCategories()
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
      category_id: form.value.category_id,
      is_active: 1
    })
    products.value.unshift(created)
    form.value = { sku: '', name: '', description: '', location: '', price: null, quantity: 0, category_id: null }
  } catch (err) {
    error.value = err.message
  }
}

async function onDelete(id) {
  if (!confirm('Är du säker? Denna åtgärd kan inte ångras.')) {
    return
  }
  error.value = ''
  try {
    await deleteProduct(id)
    products.value = products.value.filter(p => p.id !== id)
  } catch (err) {
    error.value = err.message
  }
}

function startEdit(product) {
  editingId.value = product.id
  editForm.value = { ...product }
}

function cancelEdit() {
  editingId.value = null
  editForm.value = null
}

async function onUpdate() {
  if (!editForm.value) return
  error.value = ''
  try {
    const updated = await updateProduct(editingId.value, {
      sku: editForm.value.sku,
      name: editForm.value.name,
      description: editForm.value.description || null,
      location: editForm.value.location || null,
      price: editForm.value.price === '' ? null : editForm.value.price,
      quantity: editForm.value.quantity ?? 0,
      category_id: editForm.value.category_id,
      is_active: editForm.value.is_active
    })
    const idx = products.value.findIndex(p => p.id === editingId.value)
    if (idx !== -1) {
      products.value[idx] = updated
    }
    editingId.value = null
    editForm.value = null
  } catch (err) {
    error.value = err.message
  }
}
</script>