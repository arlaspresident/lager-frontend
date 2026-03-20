<template>
  <div class="card border-warning mb-5 bg-dark">
    <div class="card-header bg-dark border-warning">
      <h2 class="text-warning mb-0">{{ title }}</h2>
    </div>
    <div class="card-body">
      <form @submit.prevent="handleSubmit">
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

        <div class="row mb-4">
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

        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-warning fw-bold">{{ submitLabel }}</button>
          <button v-if="showCancel" type="button" @click="$emit('cancel')" class="btn btn-outline-secondary">
            Avbryt
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps(['categories', 'initialData', 'title', 'submitLabel', 'showCancel'])

const emit = defineEmits(['submit', 'cancel'])

const emptyForm = () => ({
  sku: '',
  name: '',
  description: '',
  location: '',
  price: null,
  quantity: 0,
  category_id: null
})

const form = ref(props.initialData ? { ...props.initialData } : emptyForm())

// Om initialData ändras (t.ex. när man väljer en ny produkt att redigera)
watch(() => props.initialData, (newData) => {
  form.value = newData ? { ...newData } : emptyForm()
})

function handleSubmit() {
  emit('submit', { ...form.value })
  if (!props.showCancel) {
    form.value = emptyForm()
  }
}
</script>

<style scoped>
.form-control:focus,
.form-select:focus {
  background-color: #2d2d2d;
  color: white;
  border-color: #F4D03F;
  box-shadow: 0 0 0 0.2rem rgba(244, 208, 63, 0.25);
}
</style>
