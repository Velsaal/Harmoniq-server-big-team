import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

import {
  register as registerService,
  refresh as refreshService,
  logout as logoutService,
} from "../services/authService.js";

import { saveFileLocally } from "../utils/saveFileLocally.js";

/* ===================== REGISTER ===================== */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    let avatarUrl = "";

    if (req.file) {
      avatarUrl = await saveFileLocally(req.file);
    }

    const { user } = await registerService(
      name,
      email,
      password,
      avatarUrl
    );

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(201).json({
      status: 201,
      message: "User registered successfully",
      data: {
        accessToken,
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ===================== LOGIN (ИСПРАВЛЕНО) ===================== */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(401, "Email or password is wrong");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw createHttpError(401, "Email or password is wrong");
    }

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      status: 200,
      message: "User logged in successfully",
      data: {
        accessToken,
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
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

    const { user } = await refreshService(refreshToken);

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      status: 200,
      message: "Session refreshed successfully",
      data: {
        accessToken,
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
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
      bio: user.bio,
      avatarUrl: user.avatarUrl,
    },
  });
};

/* ===================== LOGOUT ===================== */
export const logout = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const [, accessToken] = authHeader.split(" ");

    if (accessToken) {
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

/* ===================== EXPORT ===================== */
export default {
  register,
  login,
  refresh,
  current,
  logout,
};
