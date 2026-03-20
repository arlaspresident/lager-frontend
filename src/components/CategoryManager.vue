<template>
  <div class="card border-warning mb-5 bg-dark">
    <div class="card-header bg-dark border-warning d-flex justify-content-between align-items-center">
      <h2 class="text-warning mb-0">Kategorier</h2>
      <button @click="showAddCategory = !showAddCategory" class="btn btn-sm btn-outline-warning">
        {{ showAddCategory ? 'Dölj' : '+ Ny kategori' }}
      </button>
    </div>
    <div class="card-body">
      <div v-if="showAddCategory" class="mb-4 pb-4 border-bottom border-warning border-opacity-25">
        <div class="d-flex gap-2">
          <input
            v-model="newCategoryName"
            type="text"
            class="form-control bg-dark text-light border-warning"
            placeholder="Kategorinamn"
            @keyup.enter="addCategory"
          />
          <button @click="addCategory" class="btn btn-warning fw-bold">Lägg till</button>
        </div>
        <p v-if="categoryError" class="alert alert-danger mt-2 mb-0">{{ categoryError }}</p>
      </div>
      <div v-if="categories.length > 0" class="d-flex flex-wrap gap-2">
        <span v-for="cat in categories" :key="cat.id" class="badge border border-warning text-warning fs-6">
          {{ cat.name }}
        </span>
      </div>
      <p v-else class="text-muted mb-0">Inga kategorier ännu</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createCategory } from '../services/api'

const props = defineProps(['categories'])

const emit = defineEmits(['category-added'])

const showAddCategory = ref(false)
const newCategoryName = ref('')
const categoryError = ref('')

async function addCategory() {
  categoryError.value = ''

  if (!newCategoryName.value.trim()) {
    categoryError.value = 'Kategorinamn kan inte vara tomt'
    return
  }

  try {
    const created = await createCategory(newCategoryName.value)
    emit('category-added', created)
    newCategoryName.value = ''
    showAddCategory.value = false
  } catch (err) {
    categoryError.value = err.message
  }
}
</script>
