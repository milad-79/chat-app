import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import config from '../configs/app.config';
import prisma from '../configs/prisma.config';
import { PayloadType } from './types/passport.types';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.JWT_SECRET || '',
};

passport.use(
  new JwtStrategy(opts, async (payload: PayloadType, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: payload.id },
        select: { username: true, id: true },
      });

      if (!user) return done(null, false);

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }),
);

export default passport;
