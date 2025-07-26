import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { registerSchema } from "../validation/authValidation.js";
import  validateBody  from "../middlewares/validateBody.js";
import { register, login, refresh, logout } from "../controllers/authController.js";

const authRouter = Router();


authRouter.post("/register", ctrlWrapper(register), validateBody(registerSchema));
authRouter.post("/login", ctrlWrapper(login))
authRouter.post("/refresh", ctrlWrapper(refresh));
authRouter.post("/logout", ctrlWrapper(logout));

export default authRouter; 