import { Request } from 'express';

type ReqCreateConvBodyType = {
  endpoint: string;
  title: string;
};

export type CreadConvPayload = {
  title: string;
  endpoint: string;
  file?: Express.Multer.File;
};

export type ReqCreateConvType = Request<{}, {}, ReqCreateConvBodyType>;
