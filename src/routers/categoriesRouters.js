import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper";

const categoryRouter = Router();

categoryRouter.get("/", ctrlWrapper(getCategories));

export default categoryRouter;
