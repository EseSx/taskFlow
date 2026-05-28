// ── Configuración de la aplicación Express ────────────────────────
// Este archivo configura el servidor Express con todos sus middlewares y rutas
// Se separa de server.js para facilitar el testing

const express = require("express");
const cors = require("cors");
const { CLIENT_URL, NODE_ENV } = require("./config/env");
const { notFound, errorHandler } = require("./middleware/errorHandler");

// Importamos las rutas
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

// Creamos la instancia de Express
const app = express();

// ── Middlewares globales ───────────────────────────────────────────

// CORS: permite que el frontend (en otro origen) haga requests al backend
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      const allowed = (process.env.CLIENT_URL || "")
        .split(",")
        .map((s) => s.trim());

      if (allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origen ${origin} no permitido`));
      }
    },
    credentials: true,
  }),
);

app.options("*", cors());

// Parsear el body de las requests como JSON
// Sin esto, req.body sería undefined
app.use(express.json());

// Parsear datos de formularios URL-encoded
app.use(express.urlencoded({ extended: true }));

// Logging simple en desarrollo (muestra método y ruta de cada request)
if (NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ── Ruta de salud del servidor ─────────────────────────────────────
// Útil para verificar que el servidor está corriendo (también para Render)
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TaskFlow API funcionando correctamente",
    timestamp: new Date().toISOString(),
  });
});

// ── Rutas de la API ────────────────────────────────────────────────
// Montamos cada router con su prefijo correspondiente
app.use("/api/auth", authRoutes); // /api/auth/register, /api/auth/login, etc.
app.use("/api/tasks", taskRoutes); // /api/tasks, /api/tasks/:id, etc.

// ── Manejo de errores ──────────────────────────────────────────────

// Maneja rutas no encontradas (404)
app.use(notFound);

// Maneja todos los errores que pasen por next(error)
app.use(errorHandler);

module.exports = app;
