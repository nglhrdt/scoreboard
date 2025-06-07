import express from 'express';
import { ObjectId } from 'mongodb';

const router = express.Router();

// POST /api/v1/games - Add a new game
router.post('/', async (req, res) => {
  const game = req.body;
  game.homeGoals = game.homeGoals || 0;
  game.awayGoals = game.awayGoals || 0;
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

/**
 * POST /api/v1/games/:id/goals - Add a goal to a game
 * Payload: { team: "home" | "away" }
 */
router.post('/:id/goals', async (req, res) => {
  const { id } = req.params;
  const { team } = req.body;

  if (!team || !['home', 'away'].includes(team.toLowerCase())) {
    return res.status(400).json({ message: 'Invalid team. Must be "home" or "away".' });
  }

  try {
    const updateField = team.toLowerCase() === 'home' ? 'homeGoals' : 'awayGoals';
    const result = await req.db
      .collection('games')
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $inc: { [updateField]: 1 } }, { returnDocument: 'after' });

    if (!result) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error adding goal:', error);
    res.status(500).json({ message: 'Error adding goal' });
  }
});

export default router;
