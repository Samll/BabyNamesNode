import { Response } from 'express';

import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { matchService } from '../services/MatchService';
import { memoryStore } from '../store/MemoryStore';

export class RoundsController {
  public static advance(req: AuthenticatedRequest, res: Response): void {
    const { coupleId, limit } = req.body as { coupleId: string; limit?: number };
    const couple = memoryStore.getCouple(coupleId);
    if (!couple) {
      res.status(404).json({ message: 'Couple not found' });
      return;
    }

    const result = matchService.advanceRound(couple, limit);
    res.status(200).json(result);
  }
}
