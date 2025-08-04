import Joi from 'joi';

export const registerSchema = Joi.object({
    name: Joi.string().min(2).max(32).required(),
    email: Joi.string().email().max(64).required(),
    password: Joi.string().min(8).max(64).required(),
    avatarUrl: Joi.string().optional(),
});