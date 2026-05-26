const app = require("./app");
const { PORT } = require("./config/env");
const prisma = require("./database/client");

// Iniciamos el servidor Express
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV}`);
});

// ── Manejo de errores no capturados ───────────────────────────────

// Errores síncronos no capturados (evitan que el servidor se caiga silenciosamente)
process.on("uncaughtException", (error) => {
  console.error("Error no capturado:", error);
  process.exit(1);
});

// Promesas rechazadas no capturadas
process.on("unhandledRejection", (reason, promise) => {
  console.error("Promesa rechazada no manejada:", reason);
  server.close(() => process.exit(1));
});

// Cierre limpio del servidor (ej: Ctrl+C o señal de Render)
process.on("SIGTERM", async () => {
  console.log("Cerrando servidor...");
  // Desconectamos Prisma antes de cerrar
  await prisma.$disconnect();
  server.close(() => {
    console.log("Servidor cerrado correctamente");
    process.exit(0);
  });
});
