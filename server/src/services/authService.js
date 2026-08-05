// ── Servicio de autenticación ─────────────────────────────────────
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../database/client");
const {
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
} = require("../config/env");

// ── Validación de contraseña fuerte ──────────────────────────────
// Mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número
const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres";
  }
  if (!/[A-Z]/.test(password)) {
    return "La contraseña debe contener al menos una mayúscula";
  }
  if (!/[a-z]/.test(password)) {
    return "La contraseña debe contener al menos una minúscula";
  }
  if (!/[0-9]/.test(password)) {
    return "La contraseña debe contener al menos un número";
  }
  return null; // null = válida
};

// ── Generación de tokens ──────────────────────────────────────────
const generateAccessToken = (userId) =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const generateRefreshToken = (userId) =>
  jwt.sign({ id: userId }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });

// ── Register ──────────────────────────────────────────────────────
const register = async ({ name, email, password }) => {
  // Validar contraseña antes de cualquier operación
  const passwordError = validatePassword(password);
  if (passwordError) {
    const err = new Error(passwordError);
    err.statusCode = 400;
    throw err;
  }

  // Verificar email único
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error("El email ya está registrado");
    err.statusCode = 409;
    throw err;
  }

  // Hashear contraseña con bcrypt (salt rounds = 12)
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return { user, accessToken, refreshToken };
};

// ── Login ─────────────────────────────────────────────────────────
const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });

  // Siempre comparamos con bcrypt aunque el usuario no exista
  // para evitar timing attacks que permitan enumerar emails
  const dummyHash = "$2a$12$dummy.hash.to.prevent.timing.attacks.padding";
  const isValid = user
    ? await bcrypt.compare(password, user.password)
    : await bcrypt.compare(password, dummyHash);

  if (!user || !isValid) {
    const err = new Error("Credenciales inválidas");
    err.statusCode = 401;
    throw err;
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return { user: safeUser, accessToken, refreshToken };
};

// ── Refresh ───────────────────────────────────────────────────────
// Verifica el refresh token y emite un nuevo access token
const refresh = async (refreshToken) => {
  if (!refreshToken) {
    const err = new Error("Refresh token requerido");
    err.statusCode = 401;
    throw err;
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
  } catch {
    const err = new Error("Refresh token inválido o expirado");
    err.statusCode = 401;
    throw err;
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  if (!user) {
    const err = new Error("Usuario no encontrado");
    err.statusCode = 401;
    throw err;
  }

  // Rotación: emitimos un nuevo par de tokens
  const newAccessToken = generateAccessToken(user.id);
  const newRefreshToken = generateRefreshToken(user.id);

  return { user, accessToken: newAccessToken, refreshToken: newRefreshToken };
};

// ── Get profile ───────────────────────────────────────────────────
const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, createdAt: true },
  });
  if (!user) {
    const err = new Error("Usuario no encontrado");
    err.statusCode = 404;
    throw err;
  }
  return user;
};

module.exports = { register, login, refresh, getProfile };
