<template>
  <div class="bg-carcare d-flex align-items-center justify-content-center min-vh-100">
    <div class="card border-warning bg-dark" style="width: 100%; max-width: 400px">
      <div class="card-body p-5">
        <div class="text-center mb-5">
          <h1 class="text-warning mb-0" style="font-size: 3rem; font-weight: 700; letter-spacing: 2px">CarCare</h1>
          <p class="text-muted mb-0 mt-3">Warehouse System</p>
        </div>

        <form @submit.prevent="onLogin">
          <div class="mb-3">
            <label for="email" class="form-label text-light">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="form-control bg-dark text-light border-warning"
              placeholder="din@email.se"
              required
            />
          </div>

          <div class="mb-4">
            <label for="password" class="form-label text-light">Lösenord</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="form-control bg-dark text-light border-warning"
              placeholder="••••••"
              required
            />
          </div>

          <button type="submit" class="btn btn-warning w-100 fw-bold mb-3">
            Logga in
          </button>

          <div v-if="error" class="alert alert-danger mb-0">{{ error }}</div>
          <div v-if="message" class="alert alert-success mb-0">{{ message }}</div>
        </form>

        <hr class="border-warning border-opacity-25 my-4" />
        <p class="text-center text-light small mb-0">
          Test: admin@carcare.se / test123
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../services/api'

const email = ref('')
const password = ref('')
const error = ref('')
const message = ref('')
const router = useRouter()

async function onLogin() {
  error.value = ''
  message.value = ''

  try {
    const response = await login(email.value, password.value)
    localStorage.setItem('token', response.token)
    message.value = 'Inloggad! Omdirigerar...'
    setTimeout(() => {
      router.push('/products')
    }, 500)
  } catch (err) {
    error.value = err.message || 'Inloggning misslyckades'
  }
}
</script>

<style scoped>
.bg-carcare {
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.form-control:focus {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border-color: #F4D03F;
  box-shadow: 0 0 0 0.2rem rgba(244, 208, 63, 0.25);
}

.form-control::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.btn-warning:hover {
  background-color: #e8c427;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(244, 208, 63, 0.3);
}

.card {
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}
</style>