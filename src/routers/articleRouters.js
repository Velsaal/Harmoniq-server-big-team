import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { getArticlesController, getArticleByIdController, createArticleController, deleteArticleController, updateArticleController} from "../controllers/articleController.js";
import validateBody from "../middlewares/validateBody.js"
import {isValidId} from "../middlewares/isValidId.js"
import { createArticlesSchema, updateArticleSchema } from "../validation/articleValidation.js";

const articleRouter = Router();

// отримати всі статті
articleRouter.get("/", ctrlWrapper(getArticlesController));
// отримати статтю по id
articleRouter.get("/:articleId", isValidId, ctrlWrapper(getArticleByIdController));
// створити статтю
articleRouter.post("/", validateBody(createArticlesSchema), ctrlWrapper(createArticleController));
// оновити статтю
articleRouter.patch("/:articleId", isValidId, validateBody(updateArticleSchema), ctrlWrapper(updateArticleController));
//видалити статтю
articleRouter.delete("/:articleId", isValidId, ctrlWrapper(deleteArticleController));

export default articleRouter; 