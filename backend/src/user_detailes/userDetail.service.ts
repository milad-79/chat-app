import prisma from '../configs/prisma.config';
import type { UserDetails } from '../generated/prisma/browser';
import Controller from '../helper/controller';
import { fileName } from '../helper/setFileName';
import { ProfileUpdatePayloadType } from './types/updateProfile.types';
import { ProfileCreatePayloadType } from './types/createProfile.types';
import {
  createProfileMessages,
  getProfileMessages,
  updateProfileMessage,
} from './userDetailes.messages';
import { BadRequest } from 'http-errors';

class UserDetailesServiceClass extends Controller {
  constructor() {
    super();
  }

  async createProfile(
    payload: ProfileCreatePayloadType,
  ): Promise<Omit<UserDetails, 'createdAt' | 'updatedAt'>> {
    const { userID: id, file, full_name } = payload;
    const isExsistUser = await this.isExsistUserWithId(id);
    if (!isExsistUser)
      throw new BadRequest(createProfileMessages.UserNotExsist);

    const details = await prisma.userDetails.create({
      data: {
        imageUrl: file ? fileName(file) : '',
        fullName: full_name,
        userId: id,
      },
      select: {
        userId: true,
        fullName: true,
        imageUrl: true,
      },
    });

    return details;
  }

  async updateProfile(
    payload: ProfileUpdatePayloadType,
  ): Promise<Omit<UserDetails, 'createdAt' | 'updatedAt'>> {
    const { userID, full_name, file } = payload;
    const isExsistUser = await this.isExsistUserWithId(userID);
    if (isExsistUser == false)
      throw new BadRequest(updateProfileMessage.UserNotExsist);

    const image_url = file ? fileName(file) : undefined;
    const updatedUser = await prisma.userDetails.update({
      where: {
        userId: userID,
      },
      data: {
        fullName: full_name,
        imageUrl: image_url,
      },
      select: {
        imageUrl: true,
        fullName: true,
        userId: true,
      },
    });

    return updatedUser;
  }

  async getUserProfile(id: string): Promise<Omit<UserDetails, 'createdAt'>> {
    const isExsistUser = await this.isExsistUserWithId(id);
    if (!isExsistUser) throw new BadRequest(getProfileMessages.UserNotExsist);

    const profile = await prisma.userDetails.findFirst({
      where: { userId: id },
      select: {
        imageUrl: true,
        fullName: true,
        userId: true,
        updatedAt: true,
      },
    });

    if (!profile) throw new BadRequest('profile Not found');
    return profile;
  }

  private async isExsistUserWithId(id: string): Promise<boolean> {
    const user = await prisma.user.findFirst({ where: { id } });
    if (!user) return false;
    return true;
  }
}

export const UserDetailesService = new UserDetailesServiceClass();
