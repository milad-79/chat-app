import { Request, Response, NextFunction } from 'express';
import passport from '../passport';
import { StatusCodes } from 'http-status-codes';
import { MiddlewareMessages } from '../messages/auth.messages';
import { UserType } from '../types/authMiddleware.types';
import prisma from '../../configs/prisma.config';

export const CheckAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate(
    'jwt',
    { session: false },
    async (err: Error | null, user: UserType | false) => {
      if (err || !user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          statusCodes: StatusCodes.UNAUTHORIZED,
          message: MiddlewareMessages.UNAUTHORIZED,
        });
      }

      const checkUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { token: true },
      });

      const authHeader = req.headers.authorization || '';
      const token = authHeader.replace(/^[Bb]earer\s+/, '').trim();

      if (!token || !checkUser?.token) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: MiddlewareMessages.TokenNotExsist });
      }

      if (!req.cookies.access_token) {
        res.cookie('access_token', token);
      }

      next();
    },
  )(req, res, next);
};
