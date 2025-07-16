import express from 'express';
import database from './db/database.js';
import v1Routes from './v1/routes/index.js';

const app = express();
app.use(express.json());
const port = 3000;

app.use('/api/v1', v1Routes);

// Start the server only after database connection is established
async function startServer() {
  try {
    await database.connect();

    app.listen(port, () => {
      console.log(`Score board listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await database.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await database.disconnect();
  process.exit(0);
});

startServer();
