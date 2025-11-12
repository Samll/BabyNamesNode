import { matchService } from '../src/services/MatchService';
import { NamePool } from '../src/models/NamePool';
import { memoryStore } from '../src/store/MemoryStore';

const buildPool = (names: string[]): NamePool => ({
  id: 'pool-1',
  names,
  eliminated: [],
  roundMatches: {}
});

describe('MatchService', () => {
  beforeEach(() => {
    memoryStore.clear();
  });

  it('limits super matches to 10% of pool capped at 5 and at least one', () => {
    const pool = buildPool(Array.from({ length: 30 }, (_, index) => `Name-${index}`));
    memoryStore.addCouple({
      id: 'couple-1',
      code: 'ABC123',
      parents: [],
      namePool: pool,
      currentRound: 0,
      superMatches: []
    });

    const result = matchService.calculateSuperMatches(pool, 'couple-1');
    expect(result).toHaveLength(3);
  });

  it('ranks super matches by net votes', () => {
    const pool = buildPool(['Amelia', 'Noah', 'Olivia', 'Liam']);
    memoryStore.addCouple({
      id: 'couple-1',
      code: 'CODE',
      parents: [],
      namePool: pool,
      currentRound: 0,
      superMatches: []
    });

    matchService.recordVote({ coupleId: 'couple-1', name: 'Olivia', parentId: 'p1', round: 1, vote: 'like', createdAt: new Date() });
    matchService.recordVote({ coupleId: 'couple-1', name: 'Olivia', parentId: 'p2', round: 1, vote: 'like', createdAt: new Date() });
    matchService.recordVote({ coupleId: 'couple-1', name: 'Liam', parentId: 'p1', round: 1, vote: 'like', createdAt: new Date() });
    matchService.recordVote({ coupleId: 'couple-1', name: 'Liam', parentId: 'p2', round: 1, vote: 'dislike', createdAt: new Date() });

    const result = matchService.calculateSuperMatches(pool, 'couple-1');
    expect(result[0]).toBe('Olivia');
    expect(result).toContain('Olivia');
  });

  it('excludes previously matched and eliminated names in future rounds', () => {
    const pool = buildPool(['Ava', 'Mia', 'Ethan', 'Logan']);
    const firstRound = matchService.calculateRoundMatches(pool, 1, 2);
    pool.eliminated.push(firstRound.matches[0]);

    const secondRound = matchService.calculateRoundMatches(pool, 2, 3);
    expect(secondRound.matches).not.toContain(firstRound.matches[0]);
    expect(secondRound.matches).not.toContain(firstRound.matches[1]);
  });
});
