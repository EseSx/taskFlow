// ── Controlador de autenticación ──────────────────────────────────
const authService = require("../services/authService");
const { NODE_ENV } = require("../config/env");

// ── Configuración de cookies ──────────────────────────────────────
// httpOnly: JavaScript nunca puede leer la cookie (protección XSS)
// secure: solo se envía por HTTPS (en producción)
// sameSite: 'lax' previene CSRF en la mayoría de casos
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

const ACCESS_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  maxAge: 15 * 60 * 1000, // 15 minutos en ms
};

const REFRESH_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en ms
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
const register = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.register(
      req.body,
    );
    setTokenCookies(res, accessToken, refreshToken);
    res.status(201).json({ success: true, data: { user } });
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
// El cliente llama a este endpoint cuando el access token expira
const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refresh_token;
    const {
      user,
      accessToken,
      refreshToken: newRefreshToken,
    } = await authService.refresh(token);
    setTokenCookies(res, accessToken, newRefreshToken);
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

module.exports = { register, login, refreshToken, logout, getMe };
