<template>
  <div class="card border-warning bg-dark h-100 hover-card">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <h5 class="card-title text-warning mb-0">{{ product.name }}</h5>
        <span class="badge bg-warning text-dark">{{ product.sku }}</span>
      </div>

      <p class="card-text text-light small mb-3">{{ product.description || 'Ingen beskrivning' }}</p>

      <div class="mb-3 pb-3 border-bottom border-warning border-opacity-25">
        <div class="row text-center">
          <div class="col-4">
            <small class="text-light">Plats</small>
            <p class="text-light mb-0">{{ product.location || '-' }}</p>
          </div>
          <div class="col-4">
            <small class="text-light">Pris</small>
            <p class="text-light mb-0">{{ product.price ? product.price + ' kr' : '-' }}</p>
          </div>
          <div class="col-4">
            <small class="text-light">Kat.</small>
            <p class="text-light mb-0 small">{{ product.category_name || '-' }}</p>
          </div>
        </div>
      </div>

      <div class="mb-3">
        <small class="text-light">Lagersaldo</small>
        <div class="d-flex align-items-center gap-2 mt-2">
          <button @click="$emit('change-stock', -1)" class="btn btn-sm btn-outline-warning">−</button>
          <span class="text-light fw-bold flex-grow-1 text-center">{{ product.quantity }} st</span>
          <button @click="$emit('change-stock', 1)" class="btn btn-sm btn-outline-warning">+</button>
        </div>
      </div>

      <div class="d-grid gap-2">
        <button @click="$emit('edit', product)" class="btn btn-sm btn-outline-warning">Redigera</button>
        <button @click="$emit('delete', product.id)" class="btn btn-sm btn-outline-danger">Radera</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['product'])

defineEmits(['change-stock', 'edit', 'delete'])
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
</style>
