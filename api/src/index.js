import cors from 'cors';
import express from 'express';
import { MongoClient } from 'mongodb';
import v1Routes from './v1/routes/index.js';

const app = express();
app.use(express.json());
const port = 3000;
app.use(cors({ origin: '*' }));

// MongoDB connection URL - read from environment variable with fallback
const mongoUrl = process.env.MONGO_URL || 'mongodb://db:27017';
const dbName = 'scoreboard';

let db;

// Connect to MongoDB first
async function connectToDatabase() {
  try {
    const client = new MongoClient(mongoUrl);
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to MongoDB successfully');
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

// Middleware to attach db to request object
app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use('/api/v1', v1Routes);

// Start the server only after database connection is established
async function startServer() {
  await connectToDatabase();

  app.listen(port, () => {
    console.log(`Score board listening on port ${port}`);
  });
}

startServer();
