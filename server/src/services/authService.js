// ── Servicio de autenticación ─────────────────────────────────────
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // Módulo nativo de Node — no requiere instalación
const prisma = require("../database/client");
const { sendVerificationEmail } = require("./emailService");
const {
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
} = require("../config/env");

// ── Validación de contraseña fuerte ──────────────────────────────
const validatePassword = (password) => {
  if (!password || password.length < 8)
    return "La contraseña debe tener al menos 8 caracteres";
  if (!/[A-Z]/.test(password))
    return "La contraseña debe contener al menos una mayúscula";
  if (!/[a-z]/.test(password))
    return "La contraseña debe contener al menos una minúscula";
  if (!/[0-9]/.test(password))
    return "La contraseña debe contener al menos un número";
  return null;
};

// ── Generación de tokens ──────────────────────────────────────────
const generateAccessToken = (userId) =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
const generateRefreshToken = (userId) =>
  jwt.sign({ id: userId }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });

// ── Generación de token de verificación ──────────────────────────
// crypto.randomBytes genera un token seguro e impredecible
const generateVerificationToken = () => crypto.randomBytes(32).toString("hex");

// ── Register ──────────────────────────────────────────────────────
const register = async ({ name, email, password }) => {
  const passwordError = validatePassword(password);
  if (passwordError) {
    const err = new Error(passwordError);
    err.statusCode = 400;
    throw err;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error("El email ya está registrado");
    err.statusCode = 409;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const verificationToken = generateVerificationToken();
  const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      verified: false, // Empieza sin verificar
      verificationToken,
      tokenExpiresAt,
    },
    select: {
      id: true,
      name: true,
      email: true,
      verified: true,
      createdAt: true,
    },
  });

  // Enviar el email con el link de verificación
  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    token: verificationToken,
  });

  // NO generamos tokens JWT todavía — el usuario debe verificar primero
  return { user };
};

// ── Verify email ──────────────────────────────────────────────────
const verifyEmail = async (token) => {
  if (!token) {
    const err = new Error("Token de verificación requerido");
    err.statusCode = 400;
    throw err;
  }

  // Buscar usuario con ese token
  const user = await prisma.user.findFirst({
    where: { verificationToken: token },
  });

  if (!user) {
    const err = new Error("Token de verificación inválido");
    err.statusCode = 400;
    throw err;
  }

  // Verificar que el token no haya expirado
  if (user.tokenExpiresAt && user.tokenExpiresAt < new Date()) {
    const err = new Error(
      "El token de verificación expiró. Regístrate nuevamente.",
    );
    err.statusCode = 400;
    throw err;
  }

  if (user.verified) {
    const err = new Error("La cuenta ya fue verificada");
    err.statusCode = 400;
    throw err;
  }

  // Marcar como verificado y limpiar el token
  const verifiedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      verified: true,
      verificationToken: null,
      tokenExpiresAt: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      verified: true,
      createdAt: true,
    },
  });

  // Ahora sí generamos los tokens JWT para iniciar sesión automáticamente
  const accessToken = generateAccessToken(verifiedUser.id);
  const refreshToken = generateRefreshToken(verifiedUser.id);

  return { user: verifiedUser, accessToken, refreshToken };
};

// ── Login ─────────────────────────────────────────────────────────
const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });

  // Siempre comparamos con bcrypt aunque el usuario no exista (anti timing attack)
  const dummyHash = "$2a$12$dummy.hash.to.prevent.timing.attacks.padding";
  const isValid = user
    ? await bcrypt.compare(password, user.password)
    : await bcrypt.compare(password, dummyHash);

  if (!user || !isValid) {
    const err = new Error("Credenciales inválidas");
    err.statusCode = 401;
    throw err;
  }

  // Bloquear login si el email no fue verificado
  if (!user.verified) {
    const err = new Error("Debes verificar tu email antes de iniciar sesión");
    err.statusCode = 403;
    err.code = "EMAIL_NOT_VERIFIED";
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

module.exports = { register, verifyEmail, login, refresh, getProfile };
