const jwt = require("jsonwebtoken");
const prisma = require("../database/client");
const { JWT_SECRET } = require("../config/env");

// ── Middleware de autenticación ──────────────────────────────────
const protect = async (req, res, next) => {
  // Leer el access token desde la httpOnly cookie
  // Fallback al header Authorization para compatibilidad con Postman/curl
  const token =
    req.cookies?.access_token ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No autorizado: token requerido" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    next();
  } catch (error) {
    // Token expirado → el cliente debe llamar a /auth/refresh
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({
          success: false,
          message: "Token expirado",
          code: "TOKEN_EXPIRED",
        });
    }
    return res.status(401).json({ success: false, message: "Token inválido" });
  }
};

module.exports = { protect };
