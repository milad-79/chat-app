import Joi from 'joi';

export const createConvSchema = Joi.object({
  title: Joi.string().min(5).max(30).required(),
  endpoint: Joi.string().min(5).max(30).required(),
});
