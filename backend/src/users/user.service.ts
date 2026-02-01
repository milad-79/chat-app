import prisma from '../configs/prisma.config';
import Controller from '../helper/controller';
import { UserPayloadType } from './types/userRegister.types';
import { BadRequest } from 'http-errors';
import {
  getUserWithUserNameMessages,
  loginMessages,
  registerUserMessages,
} from './users.messages';
import bcrypt from 'bcrypt';
import { createToken } from '../helper/createToken';
import type { User } from '../generated/prisma/browser';

class UserServiceClass extends Controller {
  constructor() {
    super();
  }

  async register(payload: UserPayloadType): Promise<string> {
    console.log(payload);

    const { username, password } = payload;
    const isUserExsist = await this.isExsitUserWithUsername(username);
    if (isUserExsist) throw new BadRequest(registerUserMessages.ThisUserExsist);

    const hashedPassword = await bcrypt.hash(password, 10);

    const data = {
      username,
      password: hashedPassword,
    };

    const user = await prisma.user.create({ data });

    const tokenData = {
      username: user.username,
      id: user.id,
    };

    const token = createToken(tokenData);

    await prisma.user.update({
      where: {
        id: tokenData.id,
      },
      data: {
        token,
      },
    });

    return token;
  }

  async login(payload: UserPayloadType): Promise<string> {
    const { username, password } = payload;
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      select: { password: true, username: true, id: true },
    });

    if (!user) throw new BadRequest(loginMessages.Bad_Request);

    const comaprePasswrod = bcrypt.compareSync(password, user.password);

    if (!comaprePasswrod) throw new BadRequest(loginMessages.Bad_Request);

    const token = createToken({
      username: user.username,
      id: user.id,
    });

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        token,
      },
    });

    return token;
  }

  async logout(id: string): Promise<void> {
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        token: '',
        isOnline: false,
      },
    });
  }

  async getUserWithUserName(
    username: string,
  ): Promise<Pick<User, 'username' | 'isOnline' | 'id'>> {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        username: true,
        isOnline: true,
        id: true,
        details: true,
      },
    });

    if (!user)
      throw new BadRequest(getUserWithUserNameMessages.ThisUserNotExsist);

    return user;
  }

  private async isExsitUserWithUsername(username: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) return false;
    return true;
  }
}

export const UserService = new UserServiceClass();
