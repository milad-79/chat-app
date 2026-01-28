import { Request } from 'express';

type DataType = {
  name: string;
  id: string;
  imageUrl: string | null;
  description: string | null;
};

type ReqCreateRoomBody = {
  name: string;
  convId: string;
  description?: string;
};

export type RoomCreatePayload = {
  convId: string;
  imageUrl?: string;
  description?: string;
  name: string;
};

export type ReqCreateRoomType = Request<{}, {}, ReqCreateRoomBody>;
