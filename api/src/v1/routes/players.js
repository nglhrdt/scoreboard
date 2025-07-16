import express from 'express';
import { ObjectId } from 'mongodb';
import database from '../../db/database.js';

const router = express.Router();

/**
 * POST /api/v1/players - Add a new player
 */
router.post('/', async (req, res) => {
  const player = req.body;
  try {
    const result = await database.getCollection('players').insertOne(player);
    res.status(201).json({ ...player, _id: result.insertedId });
  } catch (error) {
    console.error('Error adding player:', error);
    res.status(500).json({ message: 'Error adding player' });
  }
});

/**
 * GET /api/v1/players - Get all players or filter by cardID
 */
router.get('/', async (req, res) => {
  try {
    const { cardID } = req.query;
    let query = {};
    if (cardID) {
      query.cardID = cardID;
    }
    const players = await database.getCollection('players').find(query).toArray();
    res.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ message: 'Error fetching players' });
  }
});

/**
 * PUT /api/v1/players/:id - Update a player by ID
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const update = req.body;
  try {
    const result = await database.getCollection('players').updateOne({ _id: new ObjectId(id) }, { $set: update });
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Player not found' });
    }
    res.json({ message: 'Player updated' });
  } catch (error) {
    console.error('Error updating player:', error);
    res.status(500).json({ message: 'Error updating player' });
  }
});

export default router;
