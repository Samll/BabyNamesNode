import { Couple } from '../models/Couple';
import { NamePool } from '../models/NamePool';
import { RoundVote } from '../models/RoundVote';
import { NameRepository } from '../repositories/NameRepository';

export interface MatchResult {
  round: number;
  matches: string[];
}

export class MatchService {
  public constructor(private readonly nameRepository: NameRepository) {}

  public calculateRoundMatches(
    pool: NamePool,
    round: number,
    limit = 10,
    exclusions: string[] = []
  ): MatchResult {
    const assignedNames = new Set(
      Object.values(pool.roundMatches).flatMap((names) => names)
    );
    const banned = new Set([...pool.eliminated, ...exclusions]);

    const available = pool.names.filter(
      (name) => !assignedNames.has(name) && !banned.has(name)
    );

    const matches = available.slice(0, limit);
    pool.roundMatches[round] = matches;

    return { round, matches };
  }

  public async calculateSuperMatches(pool: NamePool, coupleId?: string): Promise<string[]> {
    const targetCoupleId = coupleId ?? pool.id;
    const votes = await this.nameRepository.getVotesForCouple(targetCoupleId);
    const scores = new Map<string, number>();

    for (const vote of votes) {
      const current = scores.get(vote.name) ?? 0;
      const delta = vote.vote === 'like' ? 1 : -1;
      scores.set(vote.name, current + delta);
    }

    const availableNames = pool.names.filter((name) => !pool.eliminated.includes(name));
    const sorted = [...availableNames].sort((a, b) => {
      const scoreDiff = (scores.get(b) ?? 0) - (scores.get(a) ?? 0);
      if (scoreDiff !== 0) {
        return scoreDiff;
      }
      return a.localeCompare(b);
    });

    const total = availableNames.length;
    const computedLimit = Math.min(5, Math.max(1, Math.floor(total * 0.1)) || 1);

    return sorted.slice(0, computedLimit);
  }

  public filterMatches(pool: NamePool, dislikedNames: string[]): string[] {
    const dislikedSet = new Set(dislikedNames);
    return pool.names.filter((name) => !pool.eliminated.includes(name) && !dislikedSet.has(name));
  }

  public async recordVote(vote: RoundVote): Promise<void> {
    await this.nameRepository.addVote(vote);
  }

  public async advanceRound(couple: Couple, limit = 10): Promise<MatchResult> {
    const nextRound = couple.currentRound + 1;
    const exclusions = couple.superMatches;
    const result = this.calculateRoundMatches(couple.namePool, nextRound, limit, exclusions);
    couple.currentRound = nextRound;
    await this.nameRepository.updateCouple(couple);
    return result;
  }
}
