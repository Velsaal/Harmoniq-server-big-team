import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";
import validateBody from "../middlewares/validateBody.js";

import {
  getUserInfo,
  getSavedArticles,
  addArticleToSaved,
  removeArticleFromSaved,
  updateUserInfo,
  updateUserBio,
  uploadUserAvatar,
} from "../controllers/userController.js";
import { updateBioSchema } from "../validation/userValidation.js";

const userRouter = Router();

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

/* ===== Update user ===== */
userRouter.patch(
  "/:userId",
  authMiddleware,
  ctrlWrapper(updateUserInfo)
);

/* ===== Bio ===== */
userRouter.patch(
  "/:userId/bio",
  authMiddleware,
  validateBody(updateBioSchema),
  ctrlWrapper(updateUserBio)
);

/* ===== Get user info (ВСЕГДА В КОНЦЕ) ===== */
userRouter.get(
  "/:userId",
  authMiddleware,
  ctrlWrapper(getUserInfo)
);

export default userRouter;
