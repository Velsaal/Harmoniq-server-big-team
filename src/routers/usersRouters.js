import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
  getUserInfo,
  getSavedArticles,
  addArticleToSaved,
  removeArticleFromSaved,
  updateUserInfo,
  uploadUserAvatar
} from "../controllers/userController.js";

const userRouter = Router();


userRouter.get('/:userId', ctrlWrapper(getUserInfo));
userRouter.get('/:userId/saved-articles', ctrlWrapper(getSavedArticles));
userRouter.post('/:userId/saved-articles/:articleId', ctrlWrapper(addArticleToSaved));
userRouter.delete('/:userId/saved-articles/:articleId', ctrlWrapper(removeArticleFromSaved));
userRouter.patch('/:userId', ctrlWrapper(updateUserInfo));
userRouter.post('/:userId/avatar', ctrlWrapper(uploadUserAvatar));


export default userRouter;
