import { Response } from 'express';

import { Couple } from '../models/Couple';
import { NamePool } from '../models/NamePool';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { matchService } from '../services/MatchService';
import { memoryStore } from '../store/MemoryStore';
import { generateId } from '../utils/id';

export class CouplesController {
  public static invite(req: AuthenticatedRequest, res: Response): void {
    if (!req.parentId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { partnerId, names } = req.body as { partnerId?: string; names: string[] };

    const namePool: NamePool = {
      id: generateId('pool'),
      names,
      eliminated: [],
      roundMatches: {}
    };

    const couple: Couple = {
      id: generateId('couple'),
      code: Math.random().toString(36).slice(2, 8).toUpperCase(),
      parents: partnerId ? [req.parentId, partnerId] : [req.parentId],
      namePool,
      currentRound: 0,
      superMatches: []
    };

    memoryStore.addCouple(couple);

    const initialMatches = matchService.calculateRoundMatches(couple.namePool, 1);
    couple.currentRound = 1;
    memoryStore.updateCouple(couple);

    res.status(201).json({ coupleId: couple.id, code: couple.code, matches: initialMatches.matches });
  }

  public static join(req: AuthenticatedRequest, res: Response): void {
    if (!req.parentId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { code } = req.body as { code: string };
    const couple = memoryStore.getCoupleByCode(code);
    if (!couple) {
      res.status(404).json({ message: 'Invite not found' });
      return;
    }

    if (!couple.parents.includes(req.parentId)) {
      couple.parents.push(req.parentId);
      memoryStore.updateCouple(couple);
    }

    res.status(200).json({ coupleId: couple.id, currentRound: couple.currentRound, matches: couple.namePool.roundMatches });
  }
}
