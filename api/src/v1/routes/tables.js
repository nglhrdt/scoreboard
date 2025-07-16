import express from 'express';
import { ObjectId } from 'mongodb';

const router = express.Router();

/**
 * POST /api/v1/tables - Add a new table
 */
router.post('/', async (req, res) => {
  const table = req.body;
  try {
    const result = await req.db.collection('tables').insertOne(table);
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
    const tables = await req.db.collection('tables').find(query).toArray();
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
    const result = await req.db.collection('tables').updateOne({ _id: new ObjectId(id) }, { $set: update });
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
