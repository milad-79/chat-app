import { NextFunction, Response } from 'express';
import Controller from './../helper/controller';
import { ReqSendMessageType } from './types/sendMessage.types';

import { StatusCodes } from 'http-status-codes';
import { ReqGetAllMessageType } from './types/getAllMessage.types';
import { MessagesService } from './messages.service';

class MessageControllerClass extends Controller {
  private service;
  constructor() {
    super();
    this.service = MessagesService;
  }

  async sendMessage(
    req: ReqSendMessageType,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const file = req.file;
      const payload = { file, ...req.body };
      const newMessage = await this.service.sendMessage(payload);
      return res.status(StatusCodes.CREATED).json({ ...newMessage });
    } catch (error) {
      next(error);
    }
  }

  async getAllMessagesRoomWithID(
    req: ReqGetAllMessageType,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.body;
      const messages = await this.service.getAllMessagesRoomWithID(id);
      return res.status(StatusCodes.OK).json(messages);
    } catch (error) {
      next(error);
    }
  }
}

export const MessageController = new MessageControllerClass();
