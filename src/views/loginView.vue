<template>
  <div class="bg-carcare carcare-login">
    <div class="login-container">
      <div class="text-center mb-5">
        <h1 class="carcare-title">CarCare</h1>
        <p class="carcare-subtitle">Warehouse System</p>
      </div>

      <form @submit.prevent="onLogin">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="form-control"
            placeholder="din@email.se"
            required
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Lösenord</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="form-control"
            placeholder="••••••"
            required
          />
        </div>

        <button type="submit" class="btn btn-carcare w-100 mb-3">
          Logga in
        </button>

        <p v-if="error" class="alert alert-danger">{{ error }}</p>
        <p v-if="message" class="alert alert-success">{{ message }}</p>
      </form>

      <hr />
      <p class="text-center text-muted small">
        Test: admin@carcare.se / test123
      </p>
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
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carcare-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container {
  background: rgba(26, 26, 26, 0.85);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(244, 208, 63, 0.2);
  border-radius: 12px;
  padding: 3rem 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.carcare-title {
  font-size: 3rem;
  font-weight: 700;
  color: #F4D03F;
  margin: 0;
  letter-spacing: 2px;
}

.carcare-subtitle {
  color: #aaa;
  font-size: 0.95rem;
  margin-top: 0.5rem;
  font-weight: 300;
}

.form-control {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(244, 208, 63, 0.3);
  color: white;
  font-size: 0.95rem;
}

.form-control::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.form-control:focus {
  background: rgba(255, 255, 255, 0.12);
  border-color: #F4D03F;
  box-shadow: 0 0 0 0.2rem rgba(244, 208, 63, 0.25);
  color: white;
}

.form-label {
  color: #ddd;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.btn-carcare {
  background-color: #F4D03F;
  color: #1a1a1a;
  border: none;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  transition: all 0.3s ease;
}

.btn-carcare:hover {
  background-color: #e8c427;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(244, 208, 63, 0.3);
}

hr {
  border-color: rgba(244, 208, 63, 0.2);
}

.text-muted {
  color: rgba(255, 255, 255, 0.5) !important;
}
</style>