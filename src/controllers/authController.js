import { register as registerService, login as loginService, refresh as refreshService, logout as logoutService } from "../services/authService.js";
import fs from "fs/promises";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";

// const isProduction = process.env.NODE_ENV === "production";

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    let avatarUrl = "";
    if (req.file) {
        avatarUrl = await saveFileToCloudinary(req.file);
    }
    const { user, accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn } = await registerService(name, email, password, avatarUrl);
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        expires: new Date(Date.now() + refreshTokenExpiresIn),
    });
    res.status(201).json({
        status: 201,
        message: "User registered successfully",
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            accessToken
        }
    });
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn } = await loginService(email, password);
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        expires: new Date(Date.now() + refreshTokenExpiresIn),
    });
    res.status(200).json({
        status: 200,
        message: "User logged in successfully",
        data: {  
            _id: user._id,
            name: user.name,
            avatarUrl: user.avatarUrl,
            accessToken 
        }
    });
};

export const refresh = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    const { accessToken, newRefreshToken, accessTokenExpiresIn, refreshTokenExpiresIn, user } = await refreshService(refreshToken);
    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        expires: new Date(Date.now() + refreshTokenExpiresIn),
    });
    res.status(200).json({
        status: 200,
        message: "Session refreshed successfully",
        data: { 
                name: user.name,
                email: user.email,
                avatarUrl: user.avatarUrl,
                accessToken
        }
    });
};

export const logout = async (req, res) => {
    const authHeader = req.headers.authorization || '';
    const [type, accessToken] = authHeader.split(' ');
    if (type !== 'Bearer' || !accessToken) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    await logoutService(accessToken);
  
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });
  
    res.status(200).json({
        status: 200,
        message: "Logged out successfully"
    });
  };

export default { register, login, refresh, logout };
