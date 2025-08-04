import Joi from 'joi';

export const createArticlesSchema = Joi.object({
  title: Joi.string().min(3).max(48).required(),
  desc: Joi.string().min(100).max(4000).required(),
  name: Joi.string().min(4).max(50).optional(),
  rate: Joi.number().min(0).default(0),
  date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
  article:  Joi.string().required(),
});


export const updateArticleSchema = Joi.object({
  title: Joi.string().min(3).max(48).optional(),
  desc: Joi.string().min(100).max(4000).optional(),
  name: Joi.string().min(4).max(50).optional(),
  rate: Joi.number().min(0).optional(),
  date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).optional(),
  article: Joi.string().optional(),
});