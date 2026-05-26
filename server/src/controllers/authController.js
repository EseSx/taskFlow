// ── Controlador de autenticación ──────────────────────────────────
// Maneja las requests HTTP de registro y login
// Delega la lógica de negocio al authService
// Solo se encarga de parsear el request y formatear la response

const authService = require("../services/authService");

// POST /api/auth/register
// Registra un nuevo usuario
const register = async (req, res, next) => {
  try {
    // Extraemos los datos del body de la request
    const { email, password, name } = req.body;

    // Llamamos al servicio que maneja la lógica de registro
    const { user, token } = await authService.register({
      email,
      password,
      name,
    });

    // Respondemos con 201 Created y los datos del nuevo usuario
    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      data: { user, token },
    });
  } catch (error) {
    // Pasamos el error al middleware de manejo de errores
    next(error);
  }
};

// POST /api/auth/login
// Autentica a un usuario existente
const login = async (req, res, next) => {
  try {
    // Extraemos email y password del body
    const { email, password } = req.body;

    // Llamamos al servicio que verifica las credenciales
    const { user, token } = await authService.login({ email, password });

    // Respondemos con 200 OK y el token JWT
    res.status(200).json({
      success: true,
      message: "Login exitoso",
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
// Devuelve el usuario autenticado (requiere token)
const getMe = async (req, res) => {
  // req.user ya fue cargado por el middleware protect
  res.status(200).json({
    success: true,
    data: { user: req.user },
  });
};

module.exports = { register, login, getMe };
