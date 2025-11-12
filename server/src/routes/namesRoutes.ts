import { Router } from 'express';

import { NamesController } from '../controllers/NamesController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';

const router = Router();

router.post(
  '/next',
  authMiddleware,
  validateRequest([{ field: 'coupleId', validate: (value) => typeof value === 'string' && value.length > 0 }]),
  (req, res) => {
    NamesController.next(req, res);
  }
);

router.post(
  '/vote',
  authMiddleware,
  validateRequest([
    { field: 'coupleId', validate: (value) => typeof value === 'string' && value.length > 0 },
    { field: 'name', validate: (value) => typeof value === 'string' && value.length > 0 },
    { field: 'round', validate: (value) => typeof value === 'number' && value > 0 },
    { field: 'vote', validate: (value) => value === 'like' || value === 'dislike' }
  ]),
  (req, res) => {
    NamesController.vote(req, res);
  }
);

export default router;
