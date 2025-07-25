import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper";

const articleRouter = Router();

// отримати всі статті
articleRouter.get("/", ctrlWrapper(getArticles));
// отримати статтю по id
articleRouter.get("/:articleId", ctrlWrapper(getArticleById));
// створити статтю
articleRouter.post("/", ctrlWrapper(createArticle));
// оновити статтю
articleRouter.patch("/:articleId", ctrlWrapper(updateArticle));
// видалити статтю
articleRouter.delete("/:articleId", ctrlWrapper(deleteArticle));