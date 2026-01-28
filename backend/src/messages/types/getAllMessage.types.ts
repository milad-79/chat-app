import { Request } from 'express';

type ReqBody = {
  id: string;
};

export type ReqGetAllMessageType = Request<{}, {}, ReqBody>;
