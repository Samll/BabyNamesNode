import { Router } from 'express';

import authRoutes from './authRoutes';
import couplesRoutes from './couplesRoutes';
import namesRoutes from './namesRoutes';
import roundsRoutes from './roundsRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/couples', couplesRoutes);
router.use('/names', namesRoutes);
router.use('/rounds', roundsRoutes);

export default router;
