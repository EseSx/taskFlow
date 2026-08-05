require("dotenv").config();

const required = [
  "DATABASE_URL",
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
  "CLIENT_URL",
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Variable de entorno requerida no encontrada: ${key}`);
  }
}

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET, // Clave DISTINTA para refresh tokens
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "15m", // Access token: 15 minutos
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d", // Refresh: 7 días
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL,
};
