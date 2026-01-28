import { Request } from 'express';

type ReqRegisterBody = { username: string; password: string };

interface RegisterPayload {
  username: string;
  password: string;
}

export type ReqRegisterType = Request<{}, {}, ReqRegisterBody>;

export type UserPayloadType = Required<RegisterPayload>;
