// ── Middleware de validación de datos ────────────────────────────
// Valida los datos del body antes de que lleguen al controlador
// Si hay errores, responde con 400 y los mensajes de error

// Valida el body del registro de usuario
const validateRegister = (req, res, next) => {
  const { email, password, name } = req.body;
  const errors = [];

  // Validamos que el nombre esté presente
  if (!name || name.trim().length < 2) {
    errors.push("El nombre debe tener al menos 2 caracteres");
  }

  // Validamos el formato del email con una expresión regular simple
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push("Email inválido");
  }

  // Validamos que el password tenga al menos 6 caracteres
  if (!password || password.length < 6) {
    errors.push("La contraseña debe tener al menos 6 caracteres");
  }

  // Si hay errores, respondemos con 400 Bad Request
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  // Si todo está bien, pasamos al controlador
  next();
};

// Valida el body del login
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) errors.push("El email es requerido");
  if (!password) errors.push("La contraseña es requerida");

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

// Valida el body de creación/edición de tarea
const validateTask = (req, res, next) => {
  const { title } = req.body;
  const errors = [];

  // El título es el único campo obligatorio
  if (!title || title.trim().length < 1) {
    errors.push("El título de la tarea es requerido");
  }

  if (title && title.length > 200) {
    errors.push("El título no puede superar los 200 caracteres");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

module.exports = { validateRegister, validateLogin, validateTask };
