// ── Rutas de autenticación ────────────────────────────────────────
// Prefijo: /api/auth
// Rutas públicas (no requieren token) y una ruta protegida (/me)

const express = require("express");
const router = express.Router();

// Importamos los controladores y middlewares necesarios
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { validateRegister, validateLogin } = require("../middleware/validate");

// POST /api/auth/register — Registra un nuevo usuario
// validateRegister verifica que el body tenga los datos correctos
router.post("/register", validateRegister, register);

// POST /api/auth/login — Autentica a un usuario y devuelve un token
// validateLogin verifica que email y password estén presentes
router.post("/login", validateLogin, login);

// GET /api/auth/me — Devuelve el perfil del usuario autenticado
// protect verifica que el token JWT sea válido
router.get("/me", protect, getMe);

module.exports = router;
