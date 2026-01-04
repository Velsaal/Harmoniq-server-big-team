import { Router } from "express";

import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import validateBody from "../middlewares/validateBody.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multer.js";

import { registerSchema } from "../validation/authValidation.js";

import {
  register,
  login,
  refresh,
  logout,
} from "../controllers/authController.js";

import { getCurrentUser } from "../controllers/userController.js";

const authRouter = Router();

/* ===================== AUTH ===================== */
authRouter.post(
  "/register",
  upload.single("avatar"),
  validateBody(registerSchema),
  ctrlWrapper(register)
);

authRouter.post("/login", ctrlWrapper(login));
authRouter.post("/refresh", ctrlWrapper(refresh));
authRouter.post("/logout", ctrlWrapper(logout));

/* ===================== CURRENT ===================== */
authRouter.get(
  "/current",
  authMiddleware,
  ctrlWrapper(getCurrentUser)
);

export default authRouter;

