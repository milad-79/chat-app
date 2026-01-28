import { Request } from 'express';

type UserDetaileType = {
  full_name: string;
  userID: string;
};

export type ProfileCreatePayloadType = {
  full_name: string;
  userID: string;
  file?: Express.Multer.File;
};

export type ReqCreateProfileType = Request<{}, {}, UserDetaileType>;
