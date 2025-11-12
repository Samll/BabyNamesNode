import { Prisma, PrismaClient } from '@prisma/client';

import { Couple } from '../../models/Couple';
import { NamePool } from '../../models/NamePool';
import { RoundVote } from '../../models/RoundVote';
import { NameRepository } from '../NameRepository';

const toNamePool = (value: Prisma.JsonValue): NamePool => {
  const json = (value as Prisma.JsonObject) ?? {};
  const roundMatchesRaw = (json.roundMatches as Record<string, string[]>) ?? {};
  const roundMatches: Record<number, string[]> = {};
  for (const [key, match] of Object.entries(roundMatchesRaw)) {
    roundMatches[Number(key)] = [...match];
  }
  return {
    id: (json.id as string) ?? '',
    names: (json.names as string[]) ?? [],
    eliminated: (json.eliminated as string[]) ?? [],
    roundMatches
  };
};

const serializeNamePool = (pool: NamePool): Prisma.JsonObject => {
  const roundMatches = Object.entries(pool.roundMatches).reduce<Record<string, string[]>>(
    (accumulator, [key, value]) => {
      accumulator[String(key)] = [...value];
      return accumulator;
    },
    {}
  );

  return {
    id: pool.id,
    names: [...pool.names],
    eliminated: [...pool.eliminated],
    roundMatches
  };
};

const serializeCouple = (couple: Couple) => ({
  id: couple.id,
  code: couple.code,
  parents: [...couple.parents],
  namePool: serializeNamePool(couple.namePool),
  currentRound: couple.currentRound,
  superMatches: [...couple.superMatches]
});

const toCouple = (record: Prisma.CoupleGetPayload<undefined> | null): Couple | null => {
  if (!record) {
    return null;
  }
  const parentsValue = record.parents as Prisma.JsonValue;
  const parents = Array.isArray(parentsValue) ? (parentsValue as string[]) : [];
  const superMatchesValue = record.superMatches as Prisma.JsonValue;
  const superMatches = Array.isArray(superMatchesValue) ? (superMatchesValue as string[]) : [];
  return {
    id: record.id,
    code: record.code,
    parents,
    namePool: toNamePool(record.namePool),
    currentRound: record.currentRound,
    superMatches
  };
};

export class PrismaNameRepository implements NameRepository {
  public constructor(private readonly prisma: PrismaClient) {}

  public async createCouple(couple: Couple): Promise<Couple> {
    const serialized = serializeCouple(couple);
    await this.prisma.couple.create({
      data: {
        id: serialized.id,
        code: serialized.code,
        parents: serialized.parents as unknown as Prisma.JsonArray,
        namePool: serialized.namePool as unknown as Prisma.JsonObject,
        currentRound: serialized.currentRound,
        superMatches: serialized.superMatches as unknown as Prisma.JsonArray
      }
    });
    return couple;
  }

  public async updateCouple(couple: Couple): Promise<Couple> {
    const serialized = serializeCouple(couple);
    await this.prisma.couple.update({
      where: { id: couple.id },
      data: {
        code: serialized.code,
        parents: serialized.parents as unknown as Prisma.JsonArray,
        namePool: serialized.namePool as unknown as Prisma.JsonObject,
        currentRound: serialized.currentRound,
        superMatches: serialized.superMatches as unknown as Prisma.JsonArray
      }
    });
    return couple;
  }

  public async findCoupleById(id: string): Promise<Couple | null> {
    const record = await this.prisma.couple.findUnique({ where: { id } });
    return toCouple(record);
  }

  public async findCoupleByCode(code: string): Promise<Couple | null> {
    const record = await this.prisma.couple.findUnique({ where: { code } });
    return toCouple(record);
  }

  public async addVote(vote: RoundVote): Promise<void> {
    await this.prisma.roundVote.create({
      data: {
        coupleId: vote.coupleId,
        parentId: vote.parentId,
        name: vote.name,
        round: vote.round,
        vote: vote.vote,
        createdAt: vote.createdAt
      }
    });
  }

  public async getVotesForCouple(coupleId: string): Promise<RoundVote[]> {
    const records = await this.prisma.roundVote.findMany({ where: { coupleId } });
    return records.map((record) => ({
      coupleId: record.coupleId,
      parentId: record.parentId,
      name: record.name,
      round: record.round,
      vote: record.vote as RoundVote['vote'],
      createdAt: record.createdAt
    }));
  }
}
