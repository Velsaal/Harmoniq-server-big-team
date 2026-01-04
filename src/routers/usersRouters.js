import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";

import {
  getUserInfo,
  getSavedArticles,
  addArticleToSaved,
  removeArticleFromSaved,
  updateUserInfo,
  uploadUserAvatar,
  getCurrentUser
} from "../controllers/userController.js";

const userRouter = Router();

/* 🔥 CURRENT — СТРОГО ПЕРВЫЙ */
userRouter.get(
  "/current",
  authMiddleware,
  ctrlWrapper(getCurrentUser)
);

/* ===== Saved articles ===== */
userRouter.get(
  "/:userId/saved-articles",
  authMiddleware,
  ctrlWrapper(getSavedArticles)
);

userRouter.post(
  "/:userId/saved-articles/:articleId",
  authMiddleware,
  ctrlWrapper(addArticleToSaved)
);

userRouter.delete(
  "/:userId/saved-articles/:articleId",
  authMiddleware,
  ctrlWrapper(removeArticleFromSaved)
);

/* ===== Avatar ===== */
userRouter.post(
  "/:userId/avatar",
  authMiddleware,
  upload.single("avatar"),
  ctrlWrapper(uploadUserAvatar)
);

/* ===== Update user (bio тоже тут) ===== */
userRouter.patch(
  "/:userId",
  authMiddleware,
  ctrlWrapper(updateUserInfo)
);

/* ⚠️ ВСЕГДА ПОСЛЕДНИЙ */
userRouter.get(
  "/:userId",
  authMiddleware,
  ctrlWrapper(getUserInfo)
);

export default userRouter;
