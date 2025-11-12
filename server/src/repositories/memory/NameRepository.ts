import { Couple } from '../../models/Couple';
import { RoundVote } from '../../models/RoundVote';
import { NameRepository } from '../NameRepository';

export class MemoryNameRepository implements NameRepository {
  private readonly couples = new Map<string, Couple>();
  private readonly votes: RoundVote[] = [];

  public async createCouple(couple: Couple): Promise<Couple> {
    this.couples.set(couple.id, couple);
    return couple;
  }

  public async updateCouple(couple: Couple): Promise<Couple> {
    this.couples.set(couple.id, couple);
    return couple;
  }

  public async findCoupleById(id: string): Promise<Couple | null> {
    return this.couples.get(id) ?? null;
  }

  public async findCoupleByCode(code: string): Promise<Couple | null> {
    for (const couple of this.couples.values()) {
      if (couple.code === code) {
        return couple;
      }
    }
    return null;
  }

  public async addVote(vote: RoundVote): Promise<void> {
    this.votes.push(vote);
  }

  public async getVotesForCouple(coupleId: string): Promise<RoundVote[]> {
    return this.votes.filter((vote) => vote.coupleId === coupleId);
  }
}
