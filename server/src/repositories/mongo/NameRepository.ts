import { Couple } from '../../models/Couple';
import { NamePool } from '../../models/NamePool';
import { RoundVote } from '../../models/RoundVote';
import { NameRepository } from '../NameRepository';
import { CoupleModel, RoundVoteModel } from './models';

type RoundMatchesDocument = Map<string, string[]> | Record<string, string[]> | undefined;

type CoupleDocument = Couple & {
  namePool: NamePool & { roundMatches: RoundMatchesDocument };
};

const normalizeRoundMatches = (roundMatches: RoundMatchesDocument): Record<number, string[]> => {
  if (!roundMatches) {
    return {};
  }
  const result: Record<number, string[]> = {};
  if (roundMatches instanceof Map) {
    for (const [key, value] of roundMatches.entries()) {
      result[Number(key)] = [...value];
    }
    return result;
  }
  for (const [key, value] of Object.entries(roundMatches)) {
    result[Number(key)] = [...value];
  }
  return result;
};

const toCouple = (doc: CoupleDocument | null): Couple | null => {
  if (!doc) {
    return null;
  }
  const parents = doc.parents ?? [];
  const superMatches = doc.superMatches ?? [];
  const namePool = doc.namePool ?? { id: '', names: [], eliminated: [], roundMatches: {} };
  return {
    id: doc.id,
    code: doc.code,
    parents: [...parents],
    currentRound: doc.currentRound,
    superMatches: [...superMatches],
    namePool: {
      id: namePool.id,
      names: [...namePool.names],
      eliminated: [...namePool.eliminated],
      roundMatches: normalizeRoundMatches(namePool.roundMatches)
    }
  };
};

export class MongoNameRepository implements NameRepository {
  public async createCouple(couple: Couple): Promise<Couple> {
    await CoupleModel.create(couple);
    return couple;
  }

  public async updateCouple(couple: Couple): Promise<Couple> {
    await CoupleModel.updateOne({ id: couple.id }, couple, { upsert: false }).exec();
    return couple;
  }

  public async findCoupleById(id: string): Promise<Couple | null> {
    const doc = await CoupleModel.findOne({ id }).lean<CoupleDocument>().exec();
    return toCouple(doc);
  }

  public async findCoupleByCode(code: string): Promise<Couple | null> {
    const doc = await CoupleModel.findOne({ code }).lean<CoupleDocument>().exec();
    return toCouple(doc);
  }

  public async addVote(vote: RoundVote): Promise<void> {
    await RoundVoteModel.create(vote);
  }

  public async getVotesForCouple(coupleId: string): Promise<RoundVote[]> {
    const votes = await RoundVoteModel.find({ coupleId }).lean().exec();
    return votes.map((vote) => ({
      coupleId: vote.coupleId,
      parentId: vote.parentId,
      name: vote.name,
      round: vote.round,
      vote: vote.vote as RoundVote['vote'],
      createdAt: new Date(vote.createdAt)
    }));
  }
}
