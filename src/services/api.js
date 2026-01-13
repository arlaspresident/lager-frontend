const API_BASE = '/api'


function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

//auth
export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })

  if (!res.ok) throw new Error('Fel email eller lösenord')
  return res.json()
}

export function logout() {
  localStorage.removeItem('token')
}

//produkter
export async function getProducts() {
  const res = await fetch(`${API_BASE}/products`, {
    headers: {
      ...authHeaders()
    }
  })

  if (!res.ok) throw new Error('Kunde inte hämta produkter')
  return res.json()
}

export async function updateStock(productId, delta) {
  const res = await fetch(`${API_BASE}/products/${productId}/stock`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders()
    },
    body: JSON.stringify({ delta })
  })

  if (!res.ok) {
    const msg = await res.json().catch(() => null)
    throw new Error(msg?.error || 'Kunde inte uppdatera lagersaldo')
  }

  return res.json()
}

//skapa produkt
export async function createProduct(payload) {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders()
    },
    body: JSON.stringify(payload)
  })

  if (!res.ok) {
    const msg = await res.json().catch(() => null)
    throw new Error(msg?.error || 'Kunde inte skapa produkt')
  }

  return res.json()
}

//radera produkt
export async function deleteProduct(id) {
  const response = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  })

  if (!response.ok) {
    throw new Error(`Delete failed: ${response.status}`)
  }

  return { id }
}
