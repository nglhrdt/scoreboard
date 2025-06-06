const express = require('express');
const router = express.Router();

// POST /api/v1/games - Add a new game
router.post('/', async (req, res) => {
  const game = req.body;
  try {
    const result = await req.db.collection('games').insertOne(game);
    res.status(201).json({ message: 'Game added', playerId: result.insertedId });
  } catch (error) {
    console.error('Error adding game:', error);
    res.status(500).json({ message: 'Error adding game' });
  }
});

// GET /api/v1/games - Get all games
router.get('/', async (req, res) => {
  try {
    const games = await req.db.collection('games').find().toArray();
    res.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ message: 'Error fetching games' });
  }
});

module.exports = router;
