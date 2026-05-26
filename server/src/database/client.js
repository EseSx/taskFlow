// Importamos el cliente generado por Prisma
const { PrismaClient } = require("@prisma/client");

// Creamos una única instancia del cliente (patrón Singleton)
// Esto evita crear múltiples conexiones a la base de datos
const prisma = new PrismaClient({
  // En desarrollo, mostramos las queries en la consola
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

// Exportamos la instancia para usarla en toda la aplicación
module.exports = prisma;
