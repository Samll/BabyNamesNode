import { Router } from 'express';

import { RoundsController } from '../controllers/RoundsController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';

const router = Router();

router.post(
  '/advance',
  authMiddleware,
  validateRequest([{ field: 'coupleId', validate: (value) => typeof value === 'string' && value.length > 0 }]),
  (req, res) => {
    RoundsController.advance(req, res);
  }
);

export default router;
