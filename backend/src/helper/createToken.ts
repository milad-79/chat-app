import JWT from 'jsonwebtoken';
import { BadRequest } from 'http-errors';
import config from '../configs/app.config';

type Payload = {
  username: string;
  id: string;
};

export function createToken(payload: Payload): string {
  const { id, username } = payload;
  if (!id || !username) throw new BadRequest('id and username is required');
  const token = JWT.sign(payload, config.JWT_SECRET, {
    expiresIn: 1 * 60 * 60 * 24,
  });
  return token;
}
