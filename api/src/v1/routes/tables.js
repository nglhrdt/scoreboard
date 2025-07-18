import express from 'express';
import { ObjectId } from 'mongodb';
import database from '../../db/database.js';
import { gameService } from '../services/game-service.js';

const router = express.Router();

router.get('/:tableID/active-game', async (req, res) => {
  const { tableID } = req.params;
  try {
    const activeGame = await gameService.getActiveGame(tableID);
    if (activeGame) {
      res.json(activeGame);
    } else {
      const createdGame = await gameService.createGame(tableID);
      res.status(201).json(createdGame);
    }
  } catch (error) {
    console.error('Error fetching table:', error);
    res.status(500).json({ message: 'Error fetching table' });
  }
});

router.post('/:id/game', async (req, res) => {
  const { id } = req.params;
  try {
    const newGame = await gameService.createGame(id);
    res.status(201).json(newGame);
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ message: 'Error creating game' });
  }
});

/**
 * POST /api/v1/tables - Add a new table
 */
router.post('/', async (req, res) => {
  const table = req.body;
  try {
    const result = await database.getCollection('tables').insertOne(table);
    res.status(201).json({ message: 'Table added', tableId: result.insertedId });
  } catch (error) {
    console.error('Error adding table:', error);
    res.status(500).json({ message: 'Error adding table' });
  }
});

/**
 * GET /api/v1/tables - Get all tables
 */
router.get('/', async (req, res) => {
  try {
    const { name } = req.query;
    const query = name ? { name } : {};
    const tables = await database.getCollection('tables').find(query).toArray();
    res.json(tables);
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ message: 'Error fetching tables' });
  }
});

/**
 * PUT /api/v1/tables/:id - Update a table by ID
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const update = req.body;
  try {
    const result = await database.getCollection('tables').updateOne({ _id: new ObjectId(id) }, { $set: update });
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.json({ message: 'Table updated' });
  } catch (error) {
    console.error('Error updating table:', error);
    res.status(500).json({ message: 'Error updating table' });
  }
});

export default router;
