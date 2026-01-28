import Joi from 'joi';

export const getRoomSchema = Joi.object({
  id: Joi.string().guid({ version: 'uuidv4' }).required(),
});
