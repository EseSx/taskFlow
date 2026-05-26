// ── Middleware de manejo de errores global ────────────────────────
// Este middleware captura TODOS los errores que ocurran en la app
// Se coloca al final del archivo app.js, después de todas las rutas

// Middleware para rutas no encontradas (404)
const notFound = (req, res, next) => {
  // Creamos un error con el mensaje de la ruta no encontrada
  const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  res.status(404);
  next(error); // Pasamos el error al siguiente middleware
};

// Middleware de manejo de errores general
// Express lo reconoce como error handler por los 4 parámetros (err, req, res, next)
const errorHandler = (err, req, res, next) => {
  // Si el status ya es 200 (sin error previo), lo cambiamos a 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Errores específicos de Prisma (base de datos)
  if (err.code === "P2002") {
    // Violación de unicidad (ej: email duplicado)
    return res.status(409).json({
      success: false,
      message: "Ya existe un registro con esos datos",
    });
  }

  if (err.code === "P2025") {
    // Registro no encontrado en la base de datos
    return res.status(404).json({
      success: false,
      message: "Registro no encontrado",
    });
  }

  // Respuesta de error estándar
  res.status(statusCode).json({
    success: false,
    message: err.message || "Error interno del servidor",
    // En desarrollo mostramos el stack trace, en producción no
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = { notFound, errorHandler };
