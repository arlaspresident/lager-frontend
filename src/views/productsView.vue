<template>
  <div class="bg-carcare min-vh-100 py-5">
    <div class="container">
      <!-- header -->
      <div class="card border-warning mb-5 bg-dark">
        <div class="card-body d-flex justify-content-between align-items-center">
          <div>
            <h1 class="text-warning mb-0" style="font-size: 2.5rem; font-weight: 700">CarCare Warehouse</h1>
            <p class="text-light mb-0 mt-2">Lagerhanterings system</p>
          </div>
          <button @click="onLogout" class="btn btn-outline-warning">Logga ut</button>
        </div>
      </div>

      <!-- lista eller edit -->
      <div v-if="editingId === null">
        <!-- skapa -->
        <div class="card border-warning mb-5 bg-dark">
          <div class="card-header bg-dark border-warning">
            <h2 class="text-warning mb-0">Lägg till produkt</h2>
          </div>
          <div class="card-body">
            <form @submit.prevent="onCreate">
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label text-light">SKU</label>
                  <input v-model="form.sku" class="form-control bg-dark text-light border-warning" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label text-light">Namn</label>
                  <input v-model="form.name" class="form-control bg-dark text-light border-warning" required />
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label text-light">Beskrivning</label>
                  <input v-model="form.description" class="form-control bg-dark text-light border-warning" />
                </div>
                <div class="col-md-6">
                  <label class="form-label text-light">Plats</label>
                  <input v-model="form.location" class="form-control bg-dark text-light border-warning" />
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label text-light">Pris</label>
                  <input v-model.number="form.price" type="number" class="form-control bg-dark text-light border-warning" />
                </div>
                <div class="col-md-6">
                  <label class="form-label text-light">Antal</label>
                  <input v-model.number="form.quantity" type="number" min="0" class="form-control bg-dark text-light border-warning" />
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label text-light">Kategori</label>
                  <select v-model.number="form.category_id" class="form-select bg-dark text-light border-warning">
                    <option :value="null">Ingen kategori</option>
                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                      {{ cat.name }}
                    </option>
                  </select>
                </div>
              </div>

              <button type="submit" class="btn btn-warning fw-bold">Skapa produkt</button>
            </form>
          </div>
        </div>

        <!-- produkter -->
        <div>
          <h2 class="text-warning mb-4">Produkter ({{ products.length }})</h2>
          <div class="row g-3">
            <div v-for="p in products" :key="p.id" class="col-lg-4 col-md-6">
              <div class="card border-warning bg-dark h-100 hover-card">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5 class="card-title text-warning mb-0">{{ p.name }}</h5>
                    <span class="badge bg-warning text-dark">{{ p.sku }}</span>
                  </div>

                  <p class="card-text text-light small mb-3">{{ p.description || 'Ingen beskrivning' }}</p>

                  <div class="mb-3 pb-3 border-bottom border-warning border-opacity-25">
                    <div class="row text-center">
                      <div class="col-4">
                        <small class="text-light">Plats</small>
                        <p class="text-light mb-0">{{ p.location || '-' }}</p>
                      </div>
                      <div class="col-4">
                        <small class="text-light">Pris</small>
                        <p class="text-light mb-0">{{ p.price ? p.price + ' kr' : '-' }}</p>
                      </div>
                      <div class="col-4">
                        <small class="text-light">Kat.</small>
                        <p class="text-light mb-0 small">{{ p.category_name || '-' }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="mb-3">
                    <small class="text-light">Lagersaldo</small>
                    <div class="d-flex align-items-center gap-2 mt-2">
                      <button @click="changeStock(p.id, -1)" class="btn btn-sm btn-outline-warning">−</button>
                      <span class="text-light fw-bold flex-grow-1 text-center">{{ p.quantity }} st</span>
                      <button @click="changeStock(p.id, 1)" class="btn btn-sm btn-outline-warning">+</button>
                    </div>
                  </div>

                  <div class="d-grid gap-2">
                    <button @click="startEdit(p)" class="btn btn-sm btn-outline-warning">Redigera</button>
                    <button @click="onDelete(p.id)" class="btn btn-sm btn-outline-danger">Radera</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p v-if="products.length === 0" class="text-muted text-center py-5">Inga produkter ännu</p>
        </div>
      </div>

      <!-- redigera form -->
      <div v-else class="card border-warning mb-5 bg-dark">
        <div class="card-header bg-dark border-warning">
          <h2 class="text-warning mb-0">Redigera: {{ editForm.name }}</h2>
        </div>
        <div class="card-body">
          <form @submit.prevent="onUpdate">
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label text-light">SKU</label>
                <input v-model="editForm.sku" class="form-control bg-dark text-light border-warning" required />
              </div>
              <div class="col-md-6">
                <label class="form-label text-light">Namn</label>
                <input v-model="editForm.name" class="form-control bg-dark text-light border-warning" required />
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label text-light">Beskrivning</label>
                <input v-model="editForm.description" class="form-control bg-dark text-light border-warning" />
              </div>
              <div class="col-md-6">
                <label class="form-label text-light">Plats</label>
                <input v-model="editForm.location" class="form-control bg-dark text-light border-warning" />
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label text-light">Pris</label>
                <input v-model.number="editForm.price" type="number" class="form-control bg-dark text-light border-warning" />
              </div>
              <div class="col-md-6">
                <label class="form-label text-light">Antal</label>
                <input v-model.number="editForm.quantity" type="number" min="0" class="form-control bg-dark text-light border-warning" />
              </div>
            </div>

            <div class="row mb-4">
              <div class="col-md-6">
                <label class="form-label text-light">Kategori</label>
                <select v-model.number="editForm.category_id" class="form-select bg-dark text-light border-warning">
                  <option :value="null">Ingen kategori</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-warning fw-bold">Spara ändringar</button>
              <button type="button" @click="cancelEdit" class="btn btn-outline-secondary">Avbryt</button>
            </div>
          </form>
        </div>
      </div>

      <!--error-->
      <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
    </div>
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

<style scoped>
.hover-card {
  transition: all 0.3s ease;
  cursor: default;
}

.hover-card:hover {
  border-color: rgba(244, 208, 63, 0.8) !important;
  box-shadow: 0 8px 20px rgba(244, 208, 63, 0.2);
  transform: translateY(-4px);
}

.form-control:focus,
.form-select:focus {
  background-color: #2d2d2d;
  color: white;
  border-color: #F4D03F;
  box-shadow: 0 0 0 0.2rem rgba(244, 208, 63, 0.25);
}

.btn-warning:hover {
  background-color: #e8c427;
  border-color: #e8c427;
}

.btn-outline-warning:hover {
  background-color: rgba(244, 208, 63, 0.1);
  border-color: #F4D03F;
}
</style>