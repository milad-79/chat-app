import { Request } from 'express';

type ReqBody = {
  text: string;
  roomId: string;
  userId: string;
};

export type SendMessagePayload = {
  text: string;
  roomId: string;
  userId: string;
  file?: Express.Multer.File;
};

export type ReqSendMessageType = Request<{}, {}, ReqBody>;
