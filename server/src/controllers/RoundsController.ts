import { Response } from 'express';

import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { getMatchService, getNameRepository } from '../repositories';

export class RoundsController {
  public static async advance(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { coupleId, limit } = req.body as { coupleId: string; limit?: number };
    const nameRepository = getNameRepository();
    const couple = await nameRepository.findCoupleById(coupleId);
    if (!couple) {
      res.status(404).json({ message: 'Couple not found' });
      return;
    }

    const matchService = getMatchService();
    const result = await matchService.advanceRound(couple, limit);
    res.status(200).json(result);
  }
}
