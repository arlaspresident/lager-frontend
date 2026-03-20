<template>
  <div class="bg-carcare min-vh-100 py-5">
    <div class="container">

      <AppHeader @logout="onLogout" />

      <CategoryManager :categories="categories" @category-added="onCategoryAdded" />

      <!-- skapa produkt -->
      <ProductForm
        v-if="editingId === null"
        :categories="categories"
        title="Lägg till produkt"
        submit-label="Skapa produkt"
        @submit="onCreate"
      />

      <!-- redigera produkt -->
      <ProductForm
        v-else
        :categories="categories"
        :initial-data="editForm"
        :title="'Redigera: ' + editForm.name"
        submit-label="Spara ändringar"
        :show-cancel="true"
        @submit="onUpdate"
        @cancel="cancelEdit"
      />

      <!-- produktlista -->
      <div>
        <h2 class="text-warning mb-4">Produkter ({{ products.length }})</h2>
        <div class="row g-3">
          <div v-for="p in products" :key="p.id" class="col-lg-4 col-md-6">
            <ProductCard
              :product="p"
              @change-stock="(delta) => changeStock(p.id, delta)"
              @edit="startEdit"
              @delete="onDelete"
            />
          </div>
        </div>
        <p v-if="products.length === 0" class="text-muted text-center py-5">Inga produkter ännu</p>
      </div>

      <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getProducts, getCategories, updateStock, logout, createProduct, deleteProduct, updateProduct } from '../services/api'
import AppHeader from '../components/AppHeader.vue'
import CategoryManager from '../components/CategoryManager.vue'
import ProductForm from '../components/ProductForm.vue'
import ProductCard from '../components/ProductCard.vue'

const products = ref([])
const categories = ref([])
const error = ref('')
const router = useRouter()
const editingId = ref(null)
const editForm = ref(null)

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

function onCategoryAdded(category) {
  categories.value.push(category)
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

async function onCreate(formData) {
  error.value = ''
  try {
    const created = await createProduct({
      sku: formData.sku,
      name: formData.name,
      description: formData.description || null,
      location: formData.location || null,
      price: formData.price === '' ? null : formData.price,
      quantity: formData.quantity ?? 0,
      category_id: formData.category_id,
      is_active: 1
    })

    if (created.category_id) {
      const cat = categories.value.find(c => c.id === created.category_id)
      if (cat) created.category_name = cat.name
    }

    products.value.unshift(created)
  } catch (err) {
    error.value = err.message
  }
}

async function onDelete(id) {
  if (!confirm('Är du säker? Denna åtgärd kan inte ångras.')) return
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

async function onUpdate(formData) {
  error.value = ''
  try {
    const updated = await updateProduct(editingId.value, {
      sku: formData.sku,
      name: formData.name,
      description: formData.description || null,
      location: formData.location || null,
      price: formData.price === '' ? null : formData.price,
      quantity: formData.quantity ?? 0,
      category_id: formData.category_id,
      is_active: formData.is_active
    })

    if (updated.category_id) {
      const cat = categories.value.find(c => c.id === updated.category_id)
      updated.category_name = cat ? cat.name : null
    } else {
      updated.category_name = null
    }

    const idx = products.value.findIndex(p => p.id === editingId.value)
    if (idx !== -1) products.value[idx] = updated

    editingId.value = null
    editForm.value = null
  } catch (err) {
    error.value = err.message
  }
}
</script>

<style scoped>
.btn-warning:hover {
  background-color: #e8c427;
  border-color: #e8c427;
}

.btn-outline-warning:hover {
  background-color: rgba(244, 208, 63, 0.1);
  border-color: #F4D03F;
}
</style>
