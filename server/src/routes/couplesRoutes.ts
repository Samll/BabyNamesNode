import { Router } from 'express';

import { CouplesController } from '../controllers/CouplesController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';

const router = Router();

router.post(
  '/invite',
  authMiddleware,
  validateRequest([
    { field: 'names', validate: (value) => Array.isArray(value) && value.length > 0 }
  ]),
  (req, res) => {
    CouplesController.invite(req, res);
  }
);

router.post(
  '/join',
  authMiddleware,
  validateRequest([{ field: 'code', validate: (value) => typeof value === 'string' && value.length > 0 }]),
  (req, res) => {
    CouplesController.join(req, res);
  }
);

export default router;
