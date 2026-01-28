import prisma from '../configs/prisma.config';
import Controller from '../helper/controller';
import { fileName } from '../helper/setFileName';
import {
  createConversiotionMessages,
  updateConversiotionMessages,
} from './conversition.messages';
import { BadRequest } from 'http-errors';
import { CreadConvPayload } from './types/createConversiotion.types';
import { Conversation } from '../generated/prisma/client';
import { UpdateConvPayload } from './types/updateConversition.types';

type CreateConvRes = Pick<Conversation, 'endpoint' | 'imageUrl' | 'title'> & {
  _count: {
    rooms: number;
  };
};

type GetAllConvRes = Conversation & {
  _count: {
    rooms: number;
  };
};

class ConversitionServiceClass extends Controller {
  constructor() {
    super();
  }

  async createConversition(payload: CreadConvPayload): Promise<CreateConvRes> {
    const { file, title, endpoint } = payload;
    const isExsitConv = await this.isExsittConvWithEndPoint(endpoint);
    if (isExsitConv)
      throw new BadRequest(createConversiotionMessages.ThisGroupExsist);

    const imageUrl = file ? fileName(file) : undefined;

    const newConv = await prisma.conversation.create({
      data: {
        title,
        endpoint,
        imageUrl,
      },
      select: {
        id: true,
        endpoint: true,
        title: true,
        imageUrl: true,
        _count: {
          select: { rooms: true },
        },
      },
    });

    return newConv;
  }

  async getAllConversition(): Promise<GetAllConvRes[]> {
    const conv = await prisma.conversation.findMany({
      include: {
        _count: {
          select: {
            rooms: true,
          },
        },
      },
    });

    return conv;
  }

  async updateConversition(payload: UpdateConvPayload) {
    const { id, endpoint, title, file } = payload;
    const isExsitConv = await this.isExsittConvWithId(id);
    if (isExsitConv == false)
      throw new BadRequest(updateConversiotionMessages.ThisGroupNotExsist);

    const fileUrl = file ? fileName(file) : null;

    const updatedConv = await prisma.conversation.update({
      where: {
        id,
      },
      data: {
        endpoint,
        title,
        imageUrl: fileUrl,
      },
      select: {
        endpoint: true,
        title: true,
        imageUrl: true,
        id: true,
        _count: {
          select: {
            rooms: true,
          },
        },
      },
    });

    return updatedConv;
  }

  private async isExsittConvWithEndPoint(endpoint: string): Promise<boolean> {
    const conv = await prisma.conversation.findFirst({ where: { endpoint } });
    if (!conv) return false;
    return true;
  }

  private async isExsittConvWithId(id: string): Promise<boolean> {
    const conv = await prisma.conversation.findFirst({ where: { id } });
    if (!conv) return false;
    return true;
  }
}

export const ConversitionService = new ConversitionServiceClass();
