import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper";

const userRouter = Router();

// Інформація про поточного користувача
userRouter.get('/me', ctrlWrapper(getUserInfo));
// Список збережених статей
userRouter.get('/saved-articles', ctrlWrapper(getSavedArticles));

// Додати статтю до збережених
userRouter.post('/saved-articles/:articleId', ctrlWrapper(addArticleToSaved));

// Видалити статтю зі збережених
userRouter.delete('/saved-articles/:articleId', ctrlWrapper(removeArticleFromSaved));

// Оновлення інформації про користувача
userRouter.patch('/me', ctrlWrapper(updateUserInfo));

// Додавання/оновлення аватара користувача
userRouter.post('/avatar', ctrlWrapper(uploadUserAvatar));


export default userRouter;