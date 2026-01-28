import { Request } from 'express';

type ReqBody = {
  id: string;
};

export type ReqGetAllRoomWithId = Request<{}, {}, ReqBody>;
