import { RequestHandler } from 'express';
import { Schema } from 'joi';
import { StatusCodes } from 'http-status-codes';

export const validateBody = (
  schema: Schema,
): RequestHandler<any, { statusCode: number; errors: string[] }> => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        statusCode: StatusCodes.BAD_REQUEST,
        errors: error.details.map((d) => d.message),
      });
    }

    next();
  };
};
