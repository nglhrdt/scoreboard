import express from 'express';
import pkg from '../../../package.json' with { type: 'json' };
import database from '../../db/database.js';

const router = express.Router();

router.get('/', (req, res) => {
  const response = {
    message: 'Scoreboard',
    version: pkg.version,
    timestamp: new Date().toISOString(),
    status: 'success',
    database: database.isReady() ? 'connected' : 'disconnected',
  };
  res.json(response);
});

export default router;
