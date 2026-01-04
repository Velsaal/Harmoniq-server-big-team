import Joi from "joi";

export const updateBioSchema = Joi.object({
  bio: Joi.string().max(1000).allow('').required(),
});
