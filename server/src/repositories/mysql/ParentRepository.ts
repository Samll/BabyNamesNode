import { PrismaClient, Prisma } from '@prisma/client';

import { Parent } from '../../models/Parent';
import { ParentRepository } from '../ParentRepository';

const toParent = (record: Prisma.ParentGetPayload<{ select: {
  id: true;
  email: true;
  passwordHash: true;
  displayName: true;
  preferences: true;
} }> | null): Parent | null => {
  if (!record) {
    return null;
  }
  const preferences = (record.preferences as Prisma.JsonObject) ?? { style: [], dislikedNames: [] };
  return {
    id: record.id,
    email: record.email,
    passwordHash: record.passwordHash,
    displayName: record.displayName,
    preferences: {
      style: (preferences.style as string[]) ?? [],
      dislikedNames: (preferences.dislikedNames as string[]) ?? []
    }
  };
};

export class PrismaParentRepository implements ParentRepository {
  public constructor(private readonly prisma: PrismaClient) {}

  public async create(parent: Parent): Promise<Parent> {
    await this.prisma.parent.create({
      data: {
        id: parent.id,
        email: parent.email,
        passwordHash: parent.passwordHash,
        displayName: parent.displayName,
        preferences: parent.preferences as unknown as Prisma.JsonObject
      }
    });
    return parent;
  }

  public async findByEmail(email: string): Promise<Parent | null> {
    const record = await this.prisma.parent.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        displayName: true,
        preferences: true
      }
    });
    return toParent(record);
  }

  public async findById(id: string): Promise<Parent | null> {
    const record = await this.prisma.parent.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        displayName: true,
        preferences: true
      }
    });
    return toParent(record);
  }
}
