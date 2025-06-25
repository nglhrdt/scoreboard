import express from 'express';
import gameRoutes from './games.js';
import healthRoutes from './health.js';
import playersRoutes from './players.js';
import tablesRoutes from './tables.js';

const router = express.Router();

router.use('/', healthRoutes);
router.use('/games', gameRoutes);
router.use('/players', playersRoutes);
router.use('/tables', tablesRoutes);

export default router;
