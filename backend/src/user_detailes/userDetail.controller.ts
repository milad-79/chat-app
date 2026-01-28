import Controller from '../helper/controller';
import { NextFunction, Response } from 'express';
import { ReqCreateProfileType } from './types/createProfile.types';

import { updateProfileMessage } from './userDetailes.messages';
import { StatusCodes } from 'http-status-codes';

import { ReqUpdateProfileType } from './types/updateProfile.types';
import { ReqGetProfileType } from './types/getProfile.types';
import { UserDetailesService } from './userDetail.service';

class UserDetailes extends Controller {
  private service;
  constructor() {
    super();
    this.service = UserDetailesService;
  }
  async createProfile(
    req: ReqCreateProfileType,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const file = req.file;
      const payload = { file, ...req.body };
      const detailes = await this.service.createProfile(payload);
      return res.status(StatusCodes.CREATED).json({
        userID: detailes.userId,
        full_name: detailes.fullName,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(
    req: ReqUpdateProfileType,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const file = req.file;
      const payload = { file, ...req.body };
      const updatedUser = await this.service.updateProfile(payload);

      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: updateProfileMessage.UserProfileUpdatedSuccessfully,
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserProfile(
    req: ReqGetProfileType,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.body;
      const profile = await this.service.getUserProfile(id);
      return res.status(StatusCodes.OK).json(profile);
    } catch (error) {
      next(error);
    }
  }
}

export const UserDetailesClass = new UserDetailes();
