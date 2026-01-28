import Joi from 'joi';

export const createRoomSchema = Joi.object({
  name: Joi.string().min(1).max(30).required(),
  convId: Joi.string().guid({ version: 'uuidv4' }).required(),
  description: Joi.string().min(1).max(50).optional(),
});
