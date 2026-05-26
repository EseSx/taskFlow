// ── Servicio de autenticación ─────────────────────────────────────
// Contiene la lógica de negocio para registro y login
// Los controladores delegan acá; esto mantiene los controladores limpios

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../database/client");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/env");

// Genera un token JWT firmado con el id del usuario
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, // Payload: solo guardamos el id
    JWT_SECRET, // Secreto para firmar
    { expiresIn: JWT_EXPIRES_IN }, // Tiempo de expiración
  );
};

// Registra un nuevo usuario en la base de datos
const register = async ({ email, password, name }) => {
  // Verificamos si el email ya existe en la base de datos
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const error = new Error("El email ya está registrado");
    error.statusCode = 409;
    throw error;
  }

  // Hasheamos el password con bcrypt (10 salt rounds es el estándar)
  const hashedPassword = await bcrypt.hash(password, 10);

  // Creamos el usuario en la base de datos
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name },
    // Seleccionamos solo los campos seguros (nunca devolvemos el password)
    select: { id: true, email: true, name: true, createdAt: true },
  });

  // Generamos el token JWT para el nuevo usuario
  const token = generateToken(user.id);

  return { user, token };
};

// Autentica a un usuario existente
const login = async ({ email, password }) => {
  // Buscamos el usuario por email (incluyendo el password para comparar)
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const error = new Error("Credenciales inválidas");
    error.statusCode = 401;
    throw error;
  }

  // Comparamos el password ingresado con el hash almacenado
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const error = new Error("Credenciales inválidas");
    error.statusCode = 401;
    throw error;
  }

  // Generamos el token para el usuario autenticado
  const token = generateToken(user.id);

  // Retornamos el usuario sin el password
  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

module.exports = { register, login };
