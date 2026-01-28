import dotenv from 'dotenv';

dotenv.config();

interface Config {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_USERNAME: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
  JWT_SECRET: string;
}

const config: Config = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || '',
  DATABASE_HOST: process.env.DATABASE_HOST || '',
  DATABASE_PORT: Number(process.env.DATABASE_PORT) || 3306,
  DATABASE_NAME: process.env.DATABASE_NAME || '',
  DATABASE_USERNAME: process.env.DATABASE_USERNAME || '',
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
};

export default config;
