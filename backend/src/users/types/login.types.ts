import { Request } from 'express';

type ReqLoginBody = { username: string; password: string };

export type ReqLoginType = Request<{}, {}, ReqLoginBody>;
