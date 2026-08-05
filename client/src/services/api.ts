// ── Cliente HTTP centralizado ─────────────────────────────────────
// - Envía cookies automáticamente con credentials: 'include'
// - Si el access token expiró (TOKEN_EXPIRED), intenta renovarlo
//   con /auth/refresh y reintenta la request original una vez

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const setAccessToken = (token: string | null) => {
  if (token) sessionStorage.setItem('at', token)
  else sessionStorage.removeItem('at')
}
export const getAccessToken = () => sessionStorage.getItem('at')

let isRefreshing = false

const request = async <T>(method: string, endpoint: string, body?: unknown): Promise<T> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const token = getAccessToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    credentials: 'include', // Sigue necesario para el refresh token en cookie
    body: body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) return null as T

  const data = await res.json()

  if (!res.ok && data?.code === 'TOKEN_EXPIRED' && !isRefreshing) {
    isRefreshing = true
    try {
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      })
      if (!refreshRes.ok) throw new Error('Refresh fallido')
      const refreshData = await refreshRes.json()
      setAccessToken(refreshData?.data?.accessToken ?? null)
      isRefreshing = false
      return request<T>(method, endpoint, body)
    } catch {
      isRefreshing = false
      setAccessToken(null)
      window.location.href = '/login'
      throw new Error('Sesión expirada')
    }
  }

  if (!res.ok) throw new Error(data?.message || 'Error en la request')
  return data
}

export const api = {
  get: <T>(endpoint: string) => request<T>('GET', endpoint),
  post: <T>(endpoint: string, body?: unknown) => request<T>('POST', endpoint, body),
  put: <T>(endpoint: string, body?: unknown) => request<T>('PUT', endpoint, body),
  delete: <T>(endpoint: string) => request<T>('DELETE', endpoint),
}
