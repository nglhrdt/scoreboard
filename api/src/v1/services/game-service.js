import { ObjectId } from 'mongodb';
import database from '../../db/database.js';

async function createGame(tableID) {
  const newGame = {
    tableID: new ObjectId(tableID),
    createdAt: new Date(),
    status: 'active',
    type: 'tableSoccer',
    mode: 'normal',
    homeTeam: { score: 0, players: [] },
    awayTeam: { score: 0, players: [] },
  };
  const insertResult = await database.getCollection('games').insertOne(newGame);

  return { ...newGame, _id: insertResult.insertedId };
}

async function getActiveGame(tableID) {
  const games = await database.getCollection('games').find({ tableID }).sort({ createdAt: -1 }).limit(1).toArray();

  const lastGame = games[0];

  if (!lastGame) {
    return null;
  }

  return lastGame;
}

export const gameService = { createGame, getActiveGame };
