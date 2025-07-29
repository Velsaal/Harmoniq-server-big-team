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

// ---  як  буде авторизація ---
// userRouter.get('/me', ctrlWrapper(getUserInfo));
// userRouter.get('/saved-articles', ctrlWrapper(getSavedArticles));
// userRouter.post('/saved-articles/:articleId', ctrlWrapper(addArticleToSaved));
// userRouter.delete('/saved-articles/:articleId', ctrlWrapper(removeArticleFromSaved));
// userRouter.patch('/me', ctrlWrapper(updateUserInfo));
// userRouter.post('/avatar', ctrlWrapper(uploadUserAvatar));

export default userRouter;
