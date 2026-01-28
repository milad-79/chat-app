import { Request } from 'express';

type UserDetaileUpdateType = {
  full_name?: string;
  userID: string;
};

export type ProfileUpdatePayloadType = {
  full_name?: string;
  userID: string;
  file?: Express.Multer.File;
};

export type ReqUpdateProfileType = Request<{}, {}, UserDetaileUpdateType>;
