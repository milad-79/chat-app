import prisma from '../configs/prisma.config';
import { Message, MessageFile, User } from '../generated/prisma/client';
import Controller from '../helper/controller';
import { fileName } from '../helper/setFileName';
import { sendMessages } from './message.messages';
import { SendMessagePayload } from './types/sendMessage.types';
import { BadRequest, NotFound } from 'http-errors';

type SendMessageResult = Omit<Message, 'roomId'> & {
  user: Pick<User, 'username'>;
  files: Pick<MessageFile, 'type' | 'address'>[];
};

type MessageView = Pick<
  Message,
  'id' | 'text' | 'status' | 'createdAt' | 'userId'
> & {
  user: Pick<User, 'username'>;
  files: Pick<MessageFile, 'type' | 'address'>[];
};

class MessagesServiceClass extends Controller {
  constructor() {
    super();
  }

  async sendMessage(payload: SendMessagePayload): Promise<SendMessageResult> {
    const { roomId, userId, text, file } = payload;

    const exsitRoom = await this.exsitRoom(roomId);

    if (exsitRoom == false) throw new BadRequest(sendMessages.NotExsistRoom);
    if (!userId) throw new BadRequest();

    const fileData = file
      ? { address: fileName(file), type: file.mimetype }
      : null;

    const newMessage = await prisma.message.create({
      data: {
        text: text.trim(),
        roomId,
        userId,
        ...(fileData && {
          files: {
            create: fileData,
          },
        }),
      },
      select: {
        id: true,
        createdAt: true,
        status: true,
        text: true,
        userId: true,
        user: {
          select: { username: true },
        },
        files: {
          select: {
            type: true,
            address: true,
          },
        },
      },
    });

    return newMessage;
  }

  async getAllMessagesRoomWithID(roomId: string): Promise<MessageView[]> {
    const isExsitRoom = await this.exsitRoom(roomId);
    if (!isExsitRoom) throw new BadRequest('');
    const messages = await prisma.message.findMany({
      where: {
        roomId,
      },
      select: {
        id: true,
        createdAt: true,
        status: true,
        text: true,
        userId: true,
        user: {
          select: { username: true },
        },
        files: {
          select: {
            type: true,
            address: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    if (messages.length === 0) throw new NotFound('');
    return messages;
  }

  private async exsitRoom(id: string): Promise<boolean> {
    const room = await prisma.room.findUnique({ where: { id } });
    if (room) return true;
    return false;
  }
}

export const MessagesService = new MessagesServiceClass();
