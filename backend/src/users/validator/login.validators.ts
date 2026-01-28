import Joi from 'joi';

export const loginUserSchema = Joi.object({
  username: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9_]{8,30}$'))
    .required()
    .min(8)
    .max(30)
    .messages({
      'string.empty': 'Username is required',
      'string.pattern.base':
        'Username must be 8-30 characters and can contain letters, numbers, and underscores only',
    }),
  password: Joi.string()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,16}$'))
    .required()
    .min(8)
    .max(16)
    .messages({
      'string.empty': 'Password is required',
      'string.pattern.base':
        'Password must be 8-30 characters long and include uppercase, lowercase, number, and special character',
    }),
});
