import Joi from 'joi';

export const updateRoomSchema = Joi.object({
  name: Joi.string().min(1).max(30).required(),
  id: Joi.string().guid({ version: 'uuidv4' }).required(),
  description: Joi.string().min(1).max(50).optional(),
  role: Joi.string().valid('ADMIN', 'USER').optional(),
});
