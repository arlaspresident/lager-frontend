<template>
  <div class="card border-warning mb-5 bg-dark">
    <div class="card-body d-flex justify-content-between align-items-center">
      <div>
        <h1 class="text-warning mb-0" style="font-size: 2.5rem; font-weight: 700">CarCare Warehouse</h1>
        <p class="text-light mb-0 mt-2">Lagerhanterings system</p>
      </div>
      <button @click="$emit('logout')" class="btn btn-outline-warning">Logga ut</button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['logout'])
</script>
