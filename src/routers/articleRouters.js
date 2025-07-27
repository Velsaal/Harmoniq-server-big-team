import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { getArticlesController, getArticleByIdController, createArticleController, deleteArticleController, updateArticleController} from "../controllers/articleController.js";
import validateBody from "../middlewares/validateBody.js"
import {isValidArticleId} from "../middlewares/isValidId.js"
import { createArticlesSchema, updateArticleSchema } from "../validation/articleValidation.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const articleRouter = Router();

// отримати всі статті
articleRouter.get("/", ctrlWrapper(getArticlesController));
// отримати статтю по id
articleRouter.get("/:articleId", isValidArticleId, ctrlWrapper(getArticleByIdController));
// створити статтю
articleRouter.post("/", authMiddleware, validateBody(createArticlesSchema), ctrlWrapper(createArticleController));
// оновити статтю
articleRouter.patch("/:articleId", authMiddleware, isValidArticleId, validateBody(updateArticleSchema), ctrlWrapper(updateArticleController));
//видалити статтю
articleRouter.delete("/:articleId", authMiddleware, isValidArticleId, ctrlWrapper(deleteArticleController));

export default articleRouter; 