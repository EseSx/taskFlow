// ── Servicio API ──────────────────────────────────────────────────
// Cliente HTTP centralizado para comunicarse con el backend
// Maneja automáticamente: el token JWT, errores globales y base URL

// URL base del backend (se configura en .env)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// ── Tipo de opciones para el fetch ───────────────────────────────
interface RequestOptions extends RequestInit {
  params?: Record<string, string> // Query params opcionales
}

// ── Función base de fetch ─────────────────────────────────────────
// Todas las funciones del servicio usan esta como base
async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options

  // Construimos la URL con query params si los hay
  const url = new URL(`${BASE_URL}${endpoint}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
  }

  // Obtenemos el token del localStorage para incluirlo en el header
  const token = localStorage.getItem('token')

  // Construimos los headers con JSON por defecto y el token si existe
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(fetchOptions.headers as Record<string, string>),
  }

  // Ejecutamos el fetch con todas las opciones configuradas
  const response = await fetch(url.toString(), {
    ...fetchOptions,
    headers,
  })

  // Si la respuesta es 204 (No Content, ej: DELETE), devolvemos null
  if (response.status === 204) return null as T

  // Parseamos el JSON de la respuesta
  const data = await response.json()

  // Si la respuesta no es exitosa, lanzamos un error con el mensaje del backend
  if (!response.ok) {
    const message = data.message || data.errors?.join(', ') || 'Error del servidor'
    throw new Error(message)
  }

  return data
}

// ── Métodos HTTP ──────────────────────────────────────────────────

export const api = {
  // GET: obtener datos (con query params opcionales)
  get: <T>(endpoint: string, params?: Record<string, string>) =>
    request<T>(endpoint, { method: 'GET', params }),

  // POST: crear recursos
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  // PUT: actualizar recursos
  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  // DELETE: eliminar recursos
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
}