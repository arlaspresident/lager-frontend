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
