import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { getArticlesController, getArticleByIdController } from "../utils/article.js";

const articleRouter = Router();

// отримати всі статті
articleRouter.get("/", ctrlWrapper(getArticlesController));
// отримати статтю по id
articleRouter.get("/:articleId", ctrlWrapper(getArticleByIdController));
// створити статтю
//articleRouter.post("/", ctrlWrapper(createArticle));
// оновити статтю
//articleRouter.patch("/:articleId", ctrlWrapper(updateArticle));
// видалити статтю
//articleRouter.delete("/:articleId", ctrlWrapper(deleteArticle));

export default articleRouter; 