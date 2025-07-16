import { MongoClient } from 'mongodb';

class Database {
  constructor() {
    this.client = null;
    this.db = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      const mongoUrl = process.env.MONGO_URL || 'mongodb://db:27017';
      const dbName = 'scoreboard';

      this.client = new MongoClient(mongoUrl);
      await this.client.connect();
      this.db = this.client.db(dbName);
      this.isConnected = true;

      console.log('Connected to MongoDB successfully');
      return this.db;
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      this.isConnected = false;
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.client) {
        await this.client.close();
        this.isConnected = false;
        console.log('Disconnected from MongoDB');
      }
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  getDb() {
    if (!this.isConnected || !this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  getCollection(collectionName) {
    return this.getDb().collection(collectionName);
  }

  isReady() {
    return this.isConnected && this.db !== null;
  }
}

// Export a singleton instance
const database = new Database();
export default database;
