import Joi from 'joi';

export const deleteConvSchema = Joi.object({
  id: Joi.string().guid({ version: 'uuidv4' }).required(),
});
