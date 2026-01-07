import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { createConsultation } from "../controllers/consultationController.js";
import validateBody from "../middlewares/validateBody.js";
import { createConsultationSchema } from "../validation/consultationValidation.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const consultationRouter = Router();

consultationRouter.post(
  "/",
  authMiddleware,
  validateBody(createConsultationSchema),
  ctrlWrapper(createConsultation)
);

export default consultationRouter;
