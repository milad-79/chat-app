import { NextFunction, Response } from 'express';
import Controller from './../helper/controller';
import { ReqCreateRoomType } from './types/createRoom.types';
import { createRoomMessages, updateRoomMessages } from './room.messages';
import { fileName } from './../helper/setFileName';
import { StatusCodes } from 'http-status-codes';
import { ReqUpdateRoomType } from './types/updateRoom.types';

import { ReqGetRoomType } from './types/getRoom.types';
import { ReqGetAllRoomWithId } from './types/getAllRoomWithId.types';
import { RoomService } from './room.service';

class RoomControllerClass extends Controller {
  private service;
  constructor() {
    super();
    this.service = RoomService;
  }
  async createRoom(req: ReqCreateRoomType, res: Response, next: NextFunction) {
    try {
      const fileNameUrl = req.file ? fileName(req.file) : undefined;
      const payload = { imageUrl: fileNameUrl, ...req.body };
      const newRoom = await this.service.createRoom(payload);
      return res.status(StatusCodes.CREATED).json({
        statusCode: StatusCodes.CREATED,
        message: createRoomMessages.newCreatedSuccessfully,
        data: newRoom,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateRoom(req: ReqUpdateRoomType, res: Response, next: NextFunction) {
    try {
      const file = req.file;
      const payload = { file, ...req.body };
      const updatedRoom = await this.service.updateRoom(payload);
      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: updateRoomMessages.UpdateSuccessfully,
        data: updatedRoom,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRoomMessagesWithID(
    req: ReqGetRoomType,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params;
      const room = await this.service.getRoomMessagesWithID(id);
      if (!room || !room.messages) {
        return res.status(StatusCodes.OK).json({ messages: [] });
      }
      return res.status(StatusCodes.OK).json({ messages: room.messages });
    } catch (error) {
      next(error);
    }
  }

  async getAllRoomsWithConvId(
    req: ReqGetAllRoomWithId,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.body;
      const rooms = await this.service.getAllRoomsWithConvID(id);
      return res.status(StatusCodes.OK).json(rooms);
    } catch (error) {
      next(error);
    }
  }
}

export const RoomController = new RoomControllerClass();
