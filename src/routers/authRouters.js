import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper";

const authRouter = Router();

// реєстрація
authRouter.post("/register", ctrlWrapper(register));

// вхід
authRouter.post("/login", ctrlWrapper(login));

// оновлення токену
authRouter.post("/refresh", ctrlWrapper(refresh));

// вихід
authRouter.post("/logout", ctrlWrapper(logout));

export default authRouter;