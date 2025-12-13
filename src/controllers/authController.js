import { 
  register as registerService, 
  login as loginService, 
  refresh as refreshService, 
  logout as logoutService 
} from "../services/authService.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  let avatarUrl = "";

  if (req.file) {
    avatarUrl = await saveFileToCloudinary(req.file);
  }

  const { 
    user, 
    accessToken, 
    refreshToken,
    refreshTokenExpiresIn 
  } = await registerService(name, email, password, avatarUrl);

  // ❗ БОЛЬШЕ НИКАКИХ COOKIES
  // refreshToken отправляем в JSON

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

      accessToken,
      refreshToken,          // <----- ДАЁМ ФРОНТУ!
      refreshTokenExpiresIn, // <----- тоже фронту (если надо)
    },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const { 
    user, 
    accessToken, 
    refreshToken,
    refreshTokenExpiresIn
  } = await loginService(email, password);

  // ❗ НЕТ COOKIES

  res.status(200).json({
    status: 200,
    message: "User logged in successfully",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,

      accessToken,
      refreshToken,
      refreshTokenExpiresIn,
    },
  });
};

export const refresh = async (req, res) => {
  // ❗ ТЕПЕРЬ refreshToken ИДЁТ В BODY, КАК НА ФРОНТЕ
  const { refreshToken } = req.body;

  const { 
    accessToken, 
    newRefreshToken, 
    refreshTokenExpiresIn, 
    user 
  } = await refreshService(refreshToken);

  res.status(200).json({
    status: 200,
    message: "Session refreshed successfully",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,

      accessToken,
      refreshToken: newRefreshToken,     // <--- возвращаем новый!
      refreshTokenExpiresIn,
    },
  });
};

export const logout = async (req, res) => {
  const authHeader = req.headers.authorization || "";
  const [type, accessToken] = authHeader.split(" ");

  if (type !== "Bearer" || !accessToken) {
    return res.status(401).json({ message: "No token provided" });
  }

  await logoutService(accessToken);

  // ❗ И НИЧЕГО НЕ ЧИСТИМ — НЕТ COOKIE

  res.status(200).json({
    status: 200,
    message: "Logged out successfully",
  });
};

export default { register, login, refresh, logout };
