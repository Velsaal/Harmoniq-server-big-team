import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  // 🔥 ОБЯЗАТЕЛЬНО: пропускаем preflight
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const authHeader = req.headers.authorization || "";
    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
      return next(createHttpError(401, "Unauthorized"));
    }

    if (!process.env.JWT_SECRET) {
      return next(createHttpError(500, "JWT_SECRET is not set"));
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return next(createHttpError(401, "Invalid or expired token"));
    }

    const userId =
      payload.id || payload._id || payload.userId || payload.sub;

    if (!userId) {
      return next(createHttpError(401, "Invalid token payload"));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(401, "User not found"));
    }

    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
};

export default authMiddleware;

