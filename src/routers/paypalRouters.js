import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
  capturePayPalOrderController,
  createPayPalOrderController,
  paypalWebhookController,
} from "../controllers/consultationController.js";
import validateBody from "../middlewares/validateBody.js";
import {
  capturePayPalOrderSchema,
  createPayPalOrderSchema,
} from "../validation/consultationValidation.js";

const paypalRouter = Router();

paypalRouter.post(
  "/orders",
  validateBody(createPayPalOrderSchema),
  ctrlWrapper(createPayPalOrderController)
);

paypalRouter.post(
  "/capture",
  validateBody(capturePayPalOrderSchema),
  ctrlWrapper(capturePayPalOrderController)
);

paypalRouter.post("/webhook", ctrlWrapper(paypalWebhookController));

export default paypalRouter;
