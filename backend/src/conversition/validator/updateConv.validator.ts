import Joi from 'joi';

export const updateConvSchema = Joi.object({
  id: Joi.string().guid({ version: 'uuidv4' }).required(),
  title: Joi.string().min(5).max(30),
  endpoint: Joi.string().min(5).max(30),
});
