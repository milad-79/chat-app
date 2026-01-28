import './dotenv.config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter: PrismaMariaDb = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  port: Number(process.env.DATABASE_PORT),
  database: process.env.DATABASE_NAME,
});

const prisma: PrismaClient = new PrismaClient({
  adapter,
});

export default prisma;
