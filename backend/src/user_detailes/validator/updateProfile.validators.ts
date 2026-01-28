import Joi from 'joi';

export const userDetailUpdateSchema = Joi.object({
  full_name: Joi.string().min(5).max(40),
  userID: Joi.string().guid({ version: 'uuidv4' }).required(),
});
