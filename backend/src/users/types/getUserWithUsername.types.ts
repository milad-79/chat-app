import { Request } from 'express';

export type ReqGetUserType = Request<{ username: string }>;
