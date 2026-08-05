// ── Rutas de autenticación ────────────────────────────────────────
const router = require("express").Router();
const ctrl = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/register", ctrl.register); // Crea un nuevo usuario y devuelve access + refresh tokens
router.post("/login", ctrl.login); // Devuelve access + refresh tokens para un usuario existente
router.post("/refresh", ctrl.refreshToken); // Renueva el access token usando el refresh token
router.post("/logout", ctrl.logout); // Limpia ambas cookies
router.get("/me", protect, ctrl.getMe); // Requiere access token válido

module.exports = router;
