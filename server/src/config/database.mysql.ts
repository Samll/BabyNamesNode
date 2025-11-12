import { PrismaClient } from '@prisma/client';

const DEFAULT_URL = 'mysql://root:password@localhost:3306/baby_names';

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL ?? process.env.MYSQL_URL ?? DEFAULT_URL
    }
  }
});

export const connectMySQL = async (): Promise<void> => {
  await prisma.$connect();
};

export const disconnectMySQL = async (): Promise<void> => {
  await prisma.$disconnect();
};
