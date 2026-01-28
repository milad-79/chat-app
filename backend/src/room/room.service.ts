import prisma from '../configs/prisma.config';
import type { Room } from '../generated/prisma/browser';
import Controller from '../helper/controller';
import {
  createRoomMessages,
  getRoomMessages,
  updateRoomMessages,
} from './room.messages';
import { RoomCreatePayload } from './types/createRoom.types';
import { BadRequest } from 'http-errors';
import { RoomUpdatePayload } from './types/updateRoom.types';
import { fileName } from '../helper/setFileName';

class RoomServiceClass extends Controller {
  constructor() {
    super();
  }

  async createRoom(
    payload: RoomCreatePayload,
  ): Promise<Omit<Room, 'convId' | 'createdAt' | 'updatedAt'>> {
    const { convId, imageUrl, description, name } = payload;
    const isExsistConv = await this.exsistConversition(convId);

    if (isExsistConv == false)
      throw new BadRequest(createRoomMessages.ConvNotExsist);

    const newRoom = await prisma.room.create({
      data: {
        name,
        description: description,
        convId,
        imageUrl,
      },
      select: {
        id: true,
        imageUrl: true,
        description: true,
        name: true,
      },
    });

    return newRoom;
  }

  async updateRoom(
    payload: RoomUpdatePayload,
  ): Promise<Omit<Room, 'convId' | 'createdAt' | 'updatedAt'>> {
    const { id, name, description, file } = payload;
    const exsistRoom = await this.exsistRoom(id);
    if (exsistRoom == false)
      throw new BadRequest(updateRoomMessages.RoomNotExsist);

    const imageUrl = file ? fileName(file) : undefined;
    const updatedRoom = await prisma.room.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        imageUrl,
      },
      select: {
        id: true,
        imageUrl: true,
        description: true,
        name: true,
      },
    });
    return updatedRoom;
  }

  async getAllRoomsWithConvID(
    id: string,
  ): Promise<Omit<Room, 'createdAt' | 'updatedAt' | 'convId'>[]> {
    const isExsistConv = await this.exsistConversition(id);
    if (isExsistConv == false)
      throw new BadRequest(createRoomMessages.ConvNotExsist);

    const rooms = await prisma.room.findMany({
      where: {
        convId: id,
      },
      select: {
        id: true,
        imageUrl: true,
        description: true,
        name: true,
      },
    });

    return rooms;
  }

  async getRoomMessagesWithID(id: string) {
    const exsistRoom = await this.exsistRoom(id);

    if (exsistRoom == false)
      throw new BadRequest(getRoomMessages.RoomNotExsist);

    const room = await prisma.room.findUnique({
      where: {
        id,
      },
      select: {
        messages: true,
      },
    });

    return room;
  }

  private async exsistConversition(id: string): Promise<boolean> {
    const conv = await prisma.conversation.findUnique({
      where: {
        id,
      },
    });

    if (conv) return true;
    return false;
  }

  private async exsistRoom(id: string): Promise<boolean> {
    const room = await prisma.room.findUnique({ where: { id } });
    if (room) return true;
    return false;
  }
}

export const RoomService = new RoomServiceClass();
