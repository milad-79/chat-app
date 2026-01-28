import Joi from 'joi';

export const userDetailCreateSchema = Joi.object({
  full_name: Joi.string().min(5).max(40).required(),
  userID: Joi.string().guid({ version: 'uuidv4' }).required(),
});
