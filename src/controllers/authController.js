import { register as registerService, login as loginService, refresh as refreshService, logout as logoutService } from "../services/authService.js";
import fs from "fs/promises";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    let avatarUrl = "";
    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, { folder: "avatars" });
        avatarUrl = result.secure_url;
        await fs.unlink(req.file.path); 
    }
    const user = await registerService(name, email, password, avatarUrl);
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
        }
    });
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn } = await loginService(email, password);
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        expiresIn: refreshTokenExpiresIn,
        samesite: 'strict',
    });
    res.status(200).json({
        status: 200,
        message: "User logged in successfully",
        data: { accessToken }
    });
};

export const refresh = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    const { accessToken, NewRefreshToken, accessTokenExpiresIn, refreshTokenExpiresIn } = await refreshService(req.body);
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        expiresIn: refreshTokenExpiresIn,
        samesite: 'strict',
    });
    res.status(200).json({
        status: 200,
        message: "Session refreshed successfully",
        data: { accessToken }
    });
};

export const logout = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    await logoutService(refreshToken);
    res.clearCookie('refreshToken');
    res.status(204).send();
  };

export default { register, login, refresh, logout };