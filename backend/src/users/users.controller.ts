import Controller from '../helper/controller';
import { NextFunction, Response } from 'express';
import * as Type from './types/userRegister.types';
import {
  loginMessages,
  logoutMessages,
  registerUserMessages,
} from './users.messages';
import * as StatusCode from 'http-status-codes';
import { ReqGetUserType } from './types/getUserWithUsername.types';
import { ReqLoginType } from './types/login.types';
import { ReqLogoutType } from './types/logout.types';
import { UserService } from './user.service';

class UserControllerClass extends Controller {
  private service;
  constructor() {
    super();
    this.service = UserService;
  }
  async registerUser(
    req: Type.ReqRegisterType,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const payload = req.body;

      console.log(payload);

      const token = await this.service.register(payload);

      return res.status(StatusCode.StatusCodes.CREATED).json({
        StatusCode: StatusCode.StatusCodes.CREATED,
        message: registerUserMessages.UserCreatedSuccessfully,
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: ReqLoginType, res: Response, next: NextFunction) {
    try {
      const payload = req.body;

      const token = await this.service.login(payload);

      return res.status(StatusCode.StatusCodes.OK).json({
        statusCode: StatusCode.StatusCodes.OK,
        message: loginMessages.LoginSuccessfully,
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: ReqLogoutType, res: Response, next: NextFunction) {
    try {
      const { id } = req.body;

      await this.service.logout(id);

      if (req.cookies.access_token) {
        res.clearCookie('access_token');
      }

      return res.status(StatusCode.StatusCodes.OK).json({
        statusCode: StatusCode.StatusCodes.OK,
        message: logoutMessages.LogoutSuccessfully,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserWithUserName(
    req: ReqGetUserType,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { username } = req.params;
      const user = await this.service.getUserWithUserName(username);
      return res.status(StatusCode.StatusCodes.OK).json({
        username: user.username,
        id: user.id,
        is_online: user.isOnline,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const UserController = new UserControllerClass();
