// ── Controlador de autenticación ──────────────────────────────────
const authService = require("../services/authService");
const { NODE_ENV } = require("../config/env");

// ── Configuración de cookies ──────────────────────────────────────
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};
const ACCESS_COOKIE_OPTIONS = { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 };
const REFRESH_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// ── Helper para setear ambas cookies ─────────────────────────────
const setTokenCookies = (res, accessToken, refreshToken) => {
  res.cookie("access_token", accessToken, ACCESS_COOKIE_OPTIONS);
  res.cookie("refresh_token", refreshToken, REFRESH_COOKIE_OPTIONS);
};

// ── Helper para limpiar cookies al logout ─────────────────────────
const clearTokenCookies = (res) => {
  res.clearCookie("access_token", { ...COOKIE_OPTIONS });
  res.clearCookie("refresh_token", { ...COOKIE_OPTIONS });
};

// POST /api/auth/register
// Crea la cuenta y envía el email — NO setea cookies todavía
const register = async (req, res, next) => {
  try {
    const { user } = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: "Cuenta creada. Revisa tu email para verificar tu cuenta.",
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/verify?token=xxx
// El frontend llama a este endpoint cuando el usuario hace click en el link
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    const { user, accessToken, refreshToken } =
      await authService.verifyEmail(token);
    // Verificación exitosa: seteamos las cookies y la sesión queda iniciada
    setTokenCookies(res, accessToken, refreshToken);
    res.json({
      success: true,
      message: "¡Email verificado! Tu cuenta está activa.",
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(
      req.body,
    );
    setTokenCookies(res, accessToken, refreshToken);
    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/refresh
const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refresh_token;
    const {
      user,
      accessToken,
      refreshToken: newRefresh,
    } = await authService.refresh(token);
    setTokenCookies(res, accessToken, newRefresh);
    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout
const logout = async (req, res) => {
  clearTokenCookies(res);
  res.json({ success: true, message: "Sesión cerrada" });
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, verifyEmail, login, refreshToken, logout, getMe };
