import createHttpError from "http-errors";

import {
  register as registerService,
  login as loginService,
  refresh as refreshService,
  logout as logoutService,
} from "../services/authService.js";

import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";

/* ===================== REGISTER ===================== */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    let avatarUrl = "";

    if (req.file) {
      avatarUrl = await saveFileToCloudinary(req.file);
    }

    const { user, accessToken, refreshToken, refreshTokenExpiresIn } =
      await registerService(name, email, password, avatarUrl);

    res.status(201).json({
      status: 201,
      message: "User registered successfully",
      data: {
        accessToken,
        refreshToken,
        refreshTokenExpiresIn,

        _id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,

        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ===================== LOGIN ===================== */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken, refreshTokenExpiresIn } =
      await loginService(email, password);

    res.status(200).json({
      status: 200,
      message: "User logged in successfully",
      data: {
        accessToken,
        refreshToken,
        refreshTokenExpiresIn,

        _id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,

        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ===================== REFRESH ===================== */
export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw createHttpError(401, "No refresh token");
    }

    const { accessToken, newRefreshToken, refreshTokenExpiresIn, user } =
      await refreshService(refreshToken);

    res.status(200).json({
      status: 200,
      message: "Session refreshed successfully",
      data: {
        accessToken,
        refreshToken: newRefreshToken,
        refreshTokenExpiresIn,

        _id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,

        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ===================== CURRENT ===================== */
export const current = async (req, res) => {
  const user = req.user;

  res.status(200).json({
    status: 200,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    },
  });
};

/* ===================== LOGOUT ===================== */
export const logout = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const [type, accessToken] = authHeader.split(" ");

    if (type === "Bearer" && accessToken) {
      await logoutService(accessToken);
    }

    res.status(200).json({
      status: 200,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* ===================== EXPORT (🔥 ОБЯЗАТЕЛЬНО) ===================== */
export default {
  register,
  login,
  refresh,
  current,
  logout,
};
