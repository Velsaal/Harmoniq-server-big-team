import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { getArticlesController, getArticleByIdController, createArticleController, deleteArticleController, updateArticleController} from "../controllers/articleController.js";
import validateBody from "../middlewares/validateBody.js"
import {isValidArticleId} from "../middlewares/isValidId.js"
import { createArticlesSchema, updateArticleSchema } from "../validation/articleValidation.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multer.js";

const articleRouter = Router();

articleRouter.get("/", ctrlWrapper(getArticlesController));
articleRouter.get("/:articleId", isValidArticleId, ctrlWrapper(getArticleByIdController));
articleRouter.post("/", authMiddleware, upload.single('img'), validateBody(createArticlesSchema), ctrlWrapper(createArticleController));
articleRouter.patch("/:articleId", authMiddleware, upload.single('img'), isValidArticleId, validateBody(updateArticleSchema), ctrlWrapper(updateArticleController));
articleRouter.delete("/:articleId", authMiddleware, isValidArticleId, ctrlWrapper(deleteArticleController));

export default articleRouter; 