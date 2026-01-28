import Joi from 'joi';

export const logoutSchema = Joi.object({
  id: Joi.string().guid({ version: 'uuidv4' }).required(),
});
