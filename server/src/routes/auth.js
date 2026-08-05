// ── Rutas de autenticación ────────────────────────────────────────
const router = require("express").Router();
const ctrl = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/register", ctrl.register); // POST porque viene del formulario de registro
router.get("/verify", ctrl.verifyEmail); // GET porque viene del link del email
router.post("/login", ctrl.login); // POST porque viene del formulario de login
router.post("/refresh", ctrl.refreshToken); // POST porque viene del frontend para refrescar el token
router.post("/logout", ctrl.logout); // POST porque viene del frontend para cerrar sesión
router.get("/me", protect, ctrl.getMe); // GET para obtener los datos del usuario logueado (requiere token de acceso)

module.exports = router;
