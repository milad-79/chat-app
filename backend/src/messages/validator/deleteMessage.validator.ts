import Joi from 'joi';

export const deleteMessageSchema = Joi.object({
  id: Joi.string().guid({ version: 'uuidv4' }).required(),
  roomId: Joi.string().guid({ version: 'uuidv4' }).required(),
  userId: Joi.string().guid({ version: 'uuidv4' }).required(),
});
