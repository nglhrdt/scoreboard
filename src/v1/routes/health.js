import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  const response = {
    message: 'Scoreboard',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    status: 'success',
    database: req.db ? 'connected' : 'disconnected',
  };
  res.json(response);
});

export default router;
