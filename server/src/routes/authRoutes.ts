import { Router } from 'express';

import { AuthController } from '../controllers/AuthController';
import { validateRequest } from '../middlewares/validateRequest';

const router = Router();

router.post(
  '/register',
  validateRequest([
    { field: 'email', validate: (value) => typeof value === 'string' && value.includes('@') },
    { field: 'password', validate: (value) => typeof value === 'string' && value.length >= 6 },
    { field: 'displayName', validate: (value) => typeof value === 'string' && value.length > 0 }
  ]),
  (req, res) => {
    void AuthController.register(req, res);
  }
);

router.post(
  '/login',
  validateRequest([
    { field: 'email', validate: (value) => typeof value === 'string' && value.includes('@') },
    { field: 'password', validate: (value) => typeof value === 'string' && value.length >= 6 }
  ]),
  (req, res) => {
    void AuthController.login(req, res);
  }
);

export default router;
