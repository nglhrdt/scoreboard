const express = require('express');
const router = express.Router();

// POST /api/v1/players - Add a new player
router.post('/', async (req, res) => {
  const player = req.body; // Assuming body-parser middleware is used to parse JSON
  try {
    const result = await req.db.collection('players').insertOne(player);
    res.status(201).json({ message: 'Player added', playerId: result.insertedId });
  } catch (error) {
    console.error('Error adding player:', error);
    res.status(500).json({ message: 'Error adding player' });
  }
});

// GET /api/v1/players - Get all players
router.get('/', async (req, res) => {
  try {
    const players = await req.db.collection('players').find().toArray();
    res.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ message: 'Error fetching players' });
  }
});

module.exports = router;
