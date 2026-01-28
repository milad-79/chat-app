import { Request, Response } from 'express';

type ReqType = {
  id: string;
};

export type ReqGetProfileType = Request<{}, {}, ReqType>;
