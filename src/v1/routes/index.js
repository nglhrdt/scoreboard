import express from 'express';
import gameRoutes from './games.js';
import healthRoutes from './health.js';
import playersRoutes from './players.js';

const router = express.Router();

router.use('/', healthRoutes);
router.use('/games', gameRoutes);
router.use('/players', playersRoutes);

export default router;
