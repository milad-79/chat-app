import Joi from 'joi';

export const getConvSchema = Joi.object({
  id: Joi.string().guid({ version: 'uuidv4' }).required(),
});
