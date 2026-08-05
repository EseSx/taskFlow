// ── Cliente HTTP centralizado ─────────────────────────────────────
// - Envía cookies automáticamente con credentials: 'include'
// - Si el access token expiró (TOKEN_EXPIRED), intenta renovarlo
//   con /auth/refresh y reintenta la request original una vez

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Flag para evitar loops infinitos de refresh
let isRefreshing = false
let refreshFailed = false

const request = async <T>(method: string, endpoint: string, body?: unknown): Promise<T> => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Envía y recibe cookies automáticamente
    body: body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) return null as T

  const data = await res.json()

  // Si el access token expiró, intentamos renovarlo una vez
  if (!res.ok && data?.code === 'TOKEN_EXPIRED' && !isRefreshing && !refreshFailed) {
    isRefreshing = true

    try {
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!refreshRes.ok) throw new Error('Refresh fallido')

      // Refresh exitoso: reintentar la request original
      isRefreshing = false
      return request<T>(method, endpoint, body)
    } catch {
      // Refresh falló: la sesión expiró, redirigir al login
      isRefreshing = false
      refreshFailed = true
      window.location.href = '/login'
      throw new Error('Sesión expirada')
    }
  }

  if (!res.ok) {
    const err = new Error(data?.message || 'Error en la request')
    throw err
  }

  // Resetear el flag de refresh al hacer requests exitosos
  refreshFailed = false
  return data
}

export const api = {
  get: <T>(endpoint: string) => request<T>('GET', endpoint),
  post: <T>(endpoint: string, body?: unknown) => request<T>('POST', endpoint, body),
  put: <T>(endpoint: string, body?: unknown) => request<T>('PUT', endpoint, body),
  delete: <T>(endpoint: string) => request<T>('DELETE', endpoint),
}
