import { Couple } from '../models/Couple';
import { Parent } from '../models/Parent';
import { RoundVote } from '../models/RoundVote';

class MemoryStore {
  private parents = new Map<string, Parent>();
  private couples = new Map<string, Couple>();
  private votes: RoundVote[] = [];

  public addParent(parent: Parent): void {
    this.parents.set(parent.id, parent);
  }

  public getParentByEmail(email: string): Parent | undefined {
    return Array.from(this.parents.values()).find((p) => p.email === email);
  }

  public getParent(id: string): Parent | undefined {
    return this.parents.get(id);
  }

  public addCouple(couple: Couple): void {
    this.couples.set(couple.id, couple);
  }

  public getCouple(id: string): Couple | undefined {
    return this.couples.get(id);
  }

  public getCoupleByCode(code: string): Couple | undefined {
    return Array.from(this.couples.values()).find((c) => c.code === code);
  }

  public updateCouple(couple: Couple): void {
    this.couples.set(couple.id, couple);
  }

  public addVote(vote: RoundVote): void {
    this.votes.push(vote);
  }

  public getVotesForCouple(coupleId: string): RoundVote[] {
    return this.votes.filter((vote) => vote.coupleId === coupleId);
  }

  public clear(): void {
    this.parents.clear();
    this.couples.clear();
    this.votes = [];
  }
}

export const memoryStore = new MemoryStore();
