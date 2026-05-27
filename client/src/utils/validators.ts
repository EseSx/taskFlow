// ── Utilidades de validación ──────────────────────────────────────
// Funciones puras para validar datos en el frontend
// Se usan en formularios antes de enviar al backend

// Valida el formato de un email
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email.trim())
}

// Valida que el password tenga al menos 6 caracteres
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6
}

// Valida que dos passwords coincidan
export const passwordsMatch = (password: string, confirm: string): boolean => {
  return password === confirm
}

// Valida que un campo de texto no esté vacío
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0
}

// Valida la longitud máxima de un texto
export const maxLength = (value: string, max: number): boolean => {
  return value.length <= max
}

// ── Validaciones compuestas para formularios ──────────────────────

// Valida el formulario de login y retorna los errores
export const validateLoginForm = (email: string, password: string): Record<string, string> => {
  const errors: Record<string, string> = {}

  if (!isNotEmpty(email)) {
    errors.email = 'El email es requerido'
  } else if (!isValidEmail(email)) {
    errors.email = 'El formato del email es inválido'
  }

  if (!isNotEmpty(password)) {
    errors.password = 'La contraseña es requerida'
  }

  return errors
}

// Valida el formulario de registro y retorna los errores
export const validateRegisterForm = (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): Record<string, string> => {
  const errors: Record<string, string> = {}

  if (!isNotEmpty(name) || name.trim().length < 2) {
    errors.name = 'El nombre debe tener al menos 2 caracteres'
  }

  if (!isValidEmail(email)) {
    errors.email = 'El formato del email es inválido'
  }

  if (!isValidPassword(password)) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres'
  }

  if (!passwordsMatch(password, confirmPassword)) {
    errors.confirmPassword = 'Las contraseñas no coinciden'
  }

  return errors
}

// Formatea una fecha ISO a formato legible
export const formatDate = (isoDate: string | null): string => {
  if (!isoDate) return 'Sin fecha'
  return new Date(isoDate).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Retorna la clase de color según la prioridad
export const priorityColor = (priority: 'LOW' | 'MEDIUM' | 'HIGH'): string => {
  const colors = {
    LOW: 'text-blue-400 bg-blue-400/10',
    MEDIUM: 'text-yellow-400 bg-yellow-400/10',
    HIGH: 'text-red-400 bg-red-400/10',
  }
  return colors[priority] || colors.MEDIUM
}