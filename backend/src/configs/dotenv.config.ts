import dotenv from 'dotenv';

declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    DATABASE_HOST: string;
    DATABASE_USER: string;
    DATABASE_PASSWORD: string;
    DATABASE_PORT: string;
    DATABASE_NAME: string;
    PORT?: string;
    JWT_SECRET: string;
  }
}

dotenv.config();
