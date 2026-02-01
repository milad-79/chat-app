import Controller from './../helper/controller';
import { NextFunction, Response, Request } from 'express';
import { ReqCreateConvType } from './types/createConversiotion.types';
import { StatusCodes } from 'http-status-codes';
import {
  createConversiotionMessages,
  updateConversiotionMessages,
} from './conversition.messages';
import { ReqUpdateConvType } from './types/updateConversition.types';
import { ConversitionService } from './conversition.service';

class ConversitionControllerClass extends Controller {
  private service;
  constructor() {
    super();
    this.service = ConversitionService;
  }
  async createConversition(
    req: ReqCreateConvType,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const file = req.file;
      const payload = { file, ...req.body };
      
      const newConv = await this.service.createConversition(payload);
      return res.status(StatusCodes.CREATED).json({
        statusCode: StatusCodes.CREATED,
        message: createConversiotionMessages.GroupCreatedSuccessfully,
        data: newConv,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllConversition(req: Request, res: Response, next: NextFunction) {
    try {
      const conv = await this.service.getAllConversition();
      return res.status(StatusCodes.OK).json(conv);
    } catch (error) {
      next(error);
    }
  }

  async updateConversition(
    req: ReqUpdateConvType,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const file = req.file
      const payload = { file, ...req.body };
      const updatedConv = await this.service.updateConversition(payload);
      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: updateConversiotionMessages.GroupUpdatedSuccessfully,
        data: updatedConv,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const ConversitionController = new ConversitionControllerClass();
