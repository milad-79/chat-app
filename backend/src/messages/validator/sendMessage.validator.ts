import Joi from 'joi';

export const sendMessageSchema = Joi.object({
  text: Joi.string().min(1).max(150).required(),
  roomId: Joi.string().guid({ version: 'uuidv4' }).required(),
  userId: Joi.string().guid({ version: 'uuidv4' }).required(),
});
