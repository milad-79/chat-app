import { Request } from 'express';

type ReqBody = {
  id: string;
  name?: string;
  description?: string;
  role?: 'ADMIN' | 'USER';
  userId: string;
};

export type RoomUpdatePayload = {
  id: string;
  file?: Express.Multer.File;
  description?: string;
  name?: string;
};

export type ReqUpdateRoomType = Request<{}, {}, ReqBody>;
