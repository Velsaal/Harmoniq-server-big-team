import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper";

const categoryRouter = Router();

// Отримати категорії статей
categoryRouter.get("/", ctrlWrapper(getCategories));

export default categoryRouter;
