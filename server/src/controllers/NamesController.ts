import { Response } from 'express';

import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { getMatchService, getNameRepository } from '../repositories';

export class NamesController {
  public static async next(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { coupleId, limit } = req.body as { coupleId: string; limit?: number };
    const nameRepository = getNameRepository();
    const couple = await nameRepository.findCoupleById(coupleId);
    if (!couple) {
      res.status(404).json({ message: 'Couple not found' });
      return;
    }

    const matchService = getMatchService();
    const nextRound = couple.currentRound + 1;
    const result = matchService.calculateRoundMatches(couple.namePool, nextRound, limit);
    couple.currentRound = nextRound;
    await nameRepository.updateCouple(couple);

    res.status(200).json(result);
  }

  public static async vote(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.parentId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const nameRepository = getNameRepository();
    const matchService = getMatchService();
    const { coupleId, name, round, vote } = req.body as {
      coupleId: string;
      name: string;
      round: number;
      vote: 'like' | 'dislike';
    };

    const couple = await nameRepository.findCoupleById(coupleId);
    if (!couple) {
      res.status(404).json({ message: 'Couple not found' });
      return;
    }

    await matchService.recordVote({
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

    couple.superMatches = await matchService.calculateSuperMatches(couple.namePool, couple.id);
    await nameRepository.updateCouple(couple);

    res.status(200).json({ superMatches: couple.superMatches, eliminated: couple.namePool.eliminated });
  }
}
