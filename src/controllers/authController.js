import { register as registerService, login as loginService, refresh as refreshService, logout as logoutService } from "../services/authService.js";

export const register = async (req, res) => {
    const user = await registerService(req.body);
    res.status(201).json({
        status: 201,
        message: "User registered successfully",
        data: {
         _id: user._id,
         name: user.name,
         email: user.email,
         createdAt: user.createdAt,
         updatedAt: user.updatedAt,
        }
    });
};

export const login = async (req, res) => {
    const { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn } = await loginService(req.body);
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
    res.status(200).json()
};

export default { register, login, refresh, logout };