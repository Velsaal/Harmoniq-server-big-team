import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { getArticlesController, getArticleByIdController, createArticleController, deleteArticleController, updateArticleController} from "../controllers/articleController.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createArticlesSchema, updateArticleSchema } from "../validation/articleValidation.js";

const articleRouter = Router();

// отримати всі статті
articleRouter.get("/", ctrlWrapper(getArticlesController));
// отримати статтю по id
articleRouter.get("/:articleId", ctrlWrapper(getArticleByIdController));
// створити статтю
articleRouter.post("/", validateBody(createArticlesSchema), ctrlWrapper(createArticleController));
// оновити статтю
articleRouter.patch("/:articleId", validateBody(updateArticleSchema), ctrlWrapper(updateArticleController));
//видалити статтю
articleRouter.delete("/:articleId", ctrlWrapper(deleteArticleController));

export default articleRouter; 