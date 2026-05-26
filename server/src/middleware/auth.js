// Importamos jwt para verificar tokens y el cliente de Prisma
const jwt = require("jsonwebtoken");
const prisma = require("../database/client");
const { JWT_SECRET } = require("../config/env");

// ── Middleware de autenticación ──────────────────────────────────
// Verifica que el request incluya un token JWT válido
// Si el token es válido, agrega el usuario al objeto req
// Si no, rechaza el request con un error 401

const protect = async (req, res, next) => {
  let token;

  // Buscamos el token en el header Authorization
  // El formato esperado es: "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extraemos el token (quitamos "Bearer ")
      token = req.headers.authorization.split(" ")[1];

      // Verificamos y decodificamos el token usando el secreto
      const decoded = jwt.verify(token, JWT_SECRET);

      // Buscamos el usuario en la base de datos usando el id del token
      // Excluimos el password del resultado por seguridad
      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true, createdAt: true },
      });

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      // Si todo está bien, pasamos al siguiente middleware o controlador
      next();
    } catch (error) {
      // El token expiró o es inválido
      return res.status(401).json({
        success: false,
        message: "Token inválido o expirado",
      });
    }
  }

  // Si no hay token en el header
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No autorizado: token requerido",
    });
  }
};

module.exports = { protect };
