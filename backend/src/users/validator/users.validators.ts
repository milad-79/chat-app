import Joi from 'joi';

export const registerUserSchema = Joi.object({
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
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,16}$/)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.pattern.base':
        'Password must be 8–16 characters long and include uppercase, lowercase, number, and special character',
    }),
});

export const usernameSchema = Joi.object({
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
});
