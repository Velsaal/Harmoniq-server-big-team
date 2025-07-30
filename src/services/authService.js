import User from "../models/User.js";
import Session from "../models/session.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import createHttpError from "http-errors";

const ACCESS_TOKEN_EXPIRES_IN = 15 * 60 * 1000;
const REFRESH_TOKEN_EXPIRES_IN = 30 * 24 * 60 * 60 * 1000;

export const register = async (name, email, password, avatarUrl = "") => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw createHttpError(400, 'User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, avatarUrl });

    const accessToken = crypto.randomUUID();
    const refreshToken = crypto.randomUUID();
    const now = Date.now();
    await Session.create({
        userId: user._id,
        refreshToken,
        accessToken,
        refreshTokenValidUntil: new Date(now + REFRESH_TOKEN_EXPIRES_IN),
        accessTokenValidUntil: new Date(now + ACCESS_TOKEN_EXPIRES_IN),
    });

    return {
        user,
        accessToken,
        refreshToken,
        accessTokenExpiresIn: ACCESS_TOKEN_EXPIRES_IN,
        refreshTokenExpiresIn: REFRESH_TOKEN_EXPIRES_IN,
    };
};

export const login = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw createHttpError(401, 'Invalid email or password');
    }
    const isPaswordMatch = await bcrypt.compare(password, user.password);
    if (!isPaswordMatch) {
        throw createHttpError(401, 'Invalid email or password');
    }

    await Session.deleteMany({ userId: user._id });

    const accessToken = crypto.randomUUID();
    const refreshToken = crypto.randomUUID();
    const now = Date.now();

    await Session.create({ 
        userId: user._id,
        refreshToken,
        accessToken,
        refreshTokenValidUntil: new Date(now + REFRESH_TOKEN_EXPIRES_IN),
        accessTokenValidUntil: new Date(now + ACCESS_TOKEN_EXPIRES_IN),
    });

    return {
        accessToken,
        refreshToken,
        accessTokenExpiresIn: ACCESS_TOKEN_EXPIRES_IN,
        refreshTokenExpiresIn: REFRESH_TOKEN_EXPIRES_IN,
    }; 
};

export const refresh = async (refreshToken) => { 
    if (!refreshToken) {
        throw createHttpError(401, 'No refresh token provided');
      }
      
      const session = await Session.findOne({ refreshToken });
      if (!session) {
        throw createHttpError(401, 'Session not found');
      }
      
      if (session.refreshTokenValidUntil < new Date()) {
        await Session.deleteOne({ _id: session._id });
        throw createHttpError(401, 'Refresh token expired');
      }
      
      await Session.deleteOne({ _id: session._id });
      
      const accessToken = crypto.randomUUID();
      const newRefreshToken = crypto.randomUUID();
      const now = Date.now();
      
      await Session.create({
        userId: session.userId,
        accessToken,
        refreshToken: newRefreshToken,
        accessTokenValidUntil: new Date(now + ACCESS_TOKEN_EXPIRES_IN),
        refreshTokenValidUntil: new Date(now + REFRESH_TOKEN_EXPIRES_IN),
      });
      return {
        accessToken,
        newRefreshToken,
        accessTokenExpiresIn: ACCESS_TOKEN_EXPIRES_IN,
        refreshTokenExpiresIn: REFRESH_TOKEN_EXPIRES_IN,
      };
    };

    export const logout = async (accessToken) => {
      if (!accessToken) return;
      const result = await Session.deleteOne({ accessToken });
      if (result.deletedCount === 0) {
          throw createHttpError(401, 'Session not found');
      }
  };

export default { register, login, refresh, logout };