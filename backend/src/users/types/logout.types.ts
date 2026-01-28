import { Request } from 'express';

type ReqLogoutBody = { id: string };

export type ReqLogoutType = Request<{}, {}, ReqLogoutBody>;
