import { Request } from 'express';

type ReqUpdateConvBody = {
  id: string;
  title?: string;
  endpoint?: string;
};

export type UpdateConvPayload = {
  id: string;
  title?: string;
  endpoint?: string;
  file?: Express.Multer.File;
};

export type ReqUpdateConvType = Request<{}, {}, ReqUpdateConvBody>;
