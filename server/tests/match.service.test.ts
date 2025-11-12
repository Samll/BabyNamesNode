import { MatchService } from '../src/services/MatchService';
import { NamePool } from '../src/models/NamePool';
import { MemoryNameRepository } from '../src/repositories/memory/NameRepository';

const buildPool = (names: string[]): NamePool => ({
  id: 'pool-1',
  names,
  eliminated: [],
  roundMatches: {}
});

describe('MatchService', () => {
  let matchService: MatchService;
  let nameRepository: MemoryNameRepository;

  beforeEach(() => {
    nameRepository = new MemoryNameRepository();
    matchService = new MatchService(nameRepository);
  });

  it('limits super matches to 10% of pool capped at 5 and at least one', async () => {
    const pool = buildPool(Array.from({ length: 30 }, (_, index) => `Name-${index}`));
    await nameRepository.createCouple({
      id: 'couple-1',
      code: 'ABC123',
      parents: [],
      namePool: pool,
      currentRound: 0,
      superMatches: []
    });

    const result = await matchService.calculateSuperMatches(pool, 'couple-1');
    expect(result).toHaveLength(3);
  });

  it('ranks super matches by net votes', async () => {
    const pool = buildPool(['Amelia', 'Noah', 'Olivia', 'Liam']);
    await nameRepository.createCouple({
      id: 'couple-1',
      code: 'CODE',
      parents: [],
      namePool: pool,
      currentRound: 0,
      superMatches: []
    });

    await matchService.recordVote({ coupleId: 'couple-1', name: 'Olivia', parentId: 'p1', round: 1, vote: 'like', createdAt: new Date() });
    await matchService.recordVote({ coupleId: 'couple-1', name: 'Olivia', parentId: 'p2', round: 1, vote: 'like', createdAt: new Date() });
    await matchService.recordVote({ coupleId: 'couple-1', name: 'Liam', parentId: 'p1', round: 1, vote: 'like', createdAt: new Date() });
    await matchService.recordVote({ coupleId: 'couple-1', name: 'Liam', parentId: 'p2', round: 1, vote: 'dislike', createdAt: new Date() });

    const result = await matchService.calculateSuperMatches(pool, 'couple-1');
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
