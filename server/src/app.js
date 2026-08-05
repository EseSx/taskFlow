// ── Configuración de la aplicación Express ────────────────────────
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const { CLIENT_URL } = require("./config/env");
const { errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const subtaskRoutes = require("./routes/subtasks");

const app = express();
app.set("trust proxy", 1);

// ── Helmet ────────────────────────────────────────────────────────
// Agrega headers HTTP de seguridad: X-Frame-Options, X-Content-Type-Options,
// Strict-Transport-Security, Content-Security-Policy, etc.
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────
// Si CLIENT_URL no está seteado (ej: desarrollo sin .env),
// usamos localhost:5173 como fallback seguro en lugar de permitir todo.
const allowedOrigins = (CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Postman, curl, tests
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS bloqueado para: ${origin}`));
    },
    credentials: true, // Requerido para enviar/recibir cookies cross-origin
  }),
);

// ── Rate limiting ─────────────────────────────────────────────────
// General: 100 requests por 15 minutos para toda la API
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Demasiadas solicitudes. Intenta más tarde.",
  },
});

// Estricto: 10 intentos por 15 minutos en login y registro
// Previene ataques de fuerza bruta contra contraseñas
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Demasiados intentos. Espera 15 minutos e intenta de nuevo.",
  },
});

app.use("/api", generalLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// ── Middlewares globales ──────────────────────────────────────────
app.use(express.json()); // Necesario para leer JSON en el body de las requests
app.use(express.urlencoded({ extended: true })); // Necesario para leer datos de formularios (x-www-form-urlencoded)
app.use(cookieParser()); // Necesario para leer las httpOnly cookies

// ── Health check ──────────────────────────────────────────────────
app.get("/api/health", (_req, res) =>
  res.json({
    success: true,
    message: "TaskFlow API funcionando",
    timestamp: new Date(),
  }),
);

// ── Rutas ─────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/tasks/:taskId/subtasks", subtaskRoutes);

// ── 404 ───────────────────────────────────────────────────────────
app.use((req, res) =>
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.originalUrl}`,
  }),
);

// ── Error handler ─────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
