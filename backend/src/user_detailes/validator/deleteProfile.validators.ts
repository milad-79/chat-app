import Joi from 'joi';

export const userDetailDeleteSchema = Joi.object({
  userID: Joi.string().guid({ version: 'uuidv4' }).required(),
});
