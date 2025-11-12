import { Response } from 'express';

import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { matchService } from '../services/MatchService';
import { memoryStore } from '../store/MemoryStore';

export class NamesController {
  public static next(req: AuthenticatedRequest, res: Response): void {
    const { coupleId, limit } = req.body as { coupleId: string; limit?: number };
    const couple = memoryStore.getCouple(coupleId);
    if (!couple) {
      res.status(404).json({ message: 'Couple not found' });
      return;
    }

    const nextRound = couple.currentRound + 1;
    const result = matchService.calculateRoundMatches(couple.namePool, nextRound, limit);
    couple.currentRound = nextRound;
    memoryStore.updateCouple(couple);

    res.status(200).json(result);
  }

  public static vote(req: AuthenticatedRequest, res: Response): void {
    if (!req.parentId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { coupleId, name, round, vote } = req.body as {
      coupleId: string;
      name: string;
      round: number;
      vote: 'like' | 'dislike';
    };

    const couple = memoryStore.getCouple(coupleId);
    if (!couple) {
      res.status(404).json({ message: 'Couple not found' });
      return;
    }

    matchService.recordVote({
      coupleId,
      name,
      parentId: req.parentId,
      round,
      vote,
      createdAt: new Date()
    });

    if (vote === 'dislike' && !couple.namePool.eliminated.includes(name)) {
      couple.namePool.eliminated.push(name);
    }

    couple.superMatches = matchService.calculateSuperMatches(couple.namePool, couple.id);
    memoryStore.updateCouple(couple);

    res.status(200).json({ superMatches: couple.superMatches, eliminated: couple.namePool.eliminated });
  }
}
