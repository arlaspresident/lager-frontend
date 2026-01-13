function getHeaders() {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : ''
  }
}

export async function getProducts() {
  const res = await fetch('/api/products', {
    headers: getHeaders()
  })
  if (!res.ok) throw new Error('Kunde inte hämta produkter')
  return res.json()
}

export function logout() {
  localStorage.removeItem('token')
}

export async function updateStock(productId, delta) {
  const res = await fetch(`/api/products/${productId}/stock`, {
    method: 'PATCH',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ delta })
  })

  if (!res.ok) {
    const msg = await res.json().catch(() => null)
    throw new Error(msg?.error || 'Kunde inte uppdatera lagersaldo')
  }

  return res.json()
}
