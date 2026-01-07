import Joi from "joi";

export const createConsultationSchema = Joi.object({
  consultationId: Joi.string().trim().max(64).required(),
  firstName: Joi.string().trim().max(64).required(),
  lastName: Joi.string().trim().max(64).required(),
  email: Joi.string().trim().email().required(),
  phone: Joi.string().trim().max(32).required(),
  notes: Joi.string().trim().max(1000).allow(""),
});

export const createPayPalOrderSchema = Joi.object({
  amount: Joi.number().positive().required(),
  currency: Joi.string().trim().uppercase().default("USD"),
  description: Joi.string().trim().max(120).allow(""),
  consultationId: Joi.string().trim().max(64).allow(""),
  customerEmail: Joi.string().trim().email().allow(""),
  returnUrl: Joi.string().uri().allow(""),
  cancelUrl: Joi.string().uri().allow(""),
});

export const capturePayPalOrderSchema = Joi.object({
  orderId: Joi.string().trim().required(),
});
