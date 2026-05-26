// Cargamos las variables de entorno desde el archivo .env
require("dotenv").config();

// Validamos que las variables críticas estén definidas
const required = ["DATABASE_URL", "JWT_SECRET"];

required.forEach((key) => {
  if (!process.env[key]) {
    // Si falta alguna variable obligatoria, detenemos el servidor
    console.error(`Falta la variable de entorno: ${key}`);
    process.exit(1);
  }
});

// Exportamos la configuración con valores por defecto donde aplica
module.exports = {
  // Puerto donde escucha el servidor
  PORT: process.env.PORT || 3000,

  // URL de conexión a PostgreSQL
  DATABASE_URL: process.env.DATABASE_URL,

  // Secreto para firmar y verificar JWT
  JWT_SECRET: process.env.JWT_SECRET,

  // Tiempo de expiración del token
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  // URL del cliente para configurar CORS
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",

  // Entorno de ejecución
  NODE_ENV: process.env.NODE_ENV || "development",
};
