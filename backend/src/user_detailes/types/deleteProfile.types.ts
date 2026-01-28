import { Request } from 'express';

type UserDetaileType = {
  userID: string;
};

export type ReqDeleteProfileType = Request<{}, {}, UserDetaileType>;
