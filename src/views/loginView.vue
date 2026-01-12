<template>
  <div>
    <h1>Logga in</h1>

    <form @submit.prevent="login">
      <div>
        <label>Email</label>
        <input v-model="email" type="email" required />
      </div>

      <div>
        <label>Lösenord</label>
        <input v-model="password" type="password" required />
      </div>

      <button type="submit">Logga in</button>
    </form>

    <p v-if="error" style="color:red">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const error = ref('')

async function login() {
  error.value = ''

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    if (!res.ok) {
      throw new Error('Fel email eller lösenord')
    }

    const data = await res.json()
    localStorage.setItem('token', data.token)

    alert('Inloggad!')
  } catch (err) {
    error.value = err.message
  }
}
</script>
