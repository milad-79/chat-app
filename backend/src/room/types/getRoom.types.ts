import { Request } from 'express';

type MessageBody = {
  id: string;
  text: string;
  status: boolean;
  userId: string;
};

type ReqBody = {
  id: string;
};

export type ReqGetRoomType = Request<ReqBody>;
