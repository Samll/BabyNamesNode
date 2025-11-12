import { Couple } from '../models/Couple';
import { RoundVote } from '../models/RoundVote';

export interface NameRepository {
  createCouple(couple: Couple): Promise<Couple>;
  updateCouple(couple: Couple): Promise<Couple>;
  findCoupleById(id: string): Promise<Couple | null>;
  findCoupleByCode(code: string): Promise<Couple | null>;
  addVote(vote: RoundVote): Promise<void>;
  getVotesForCouple(coupleId: string): Promise<RoundVote[]>;
}
