import { createGame, updateGame } from "./game-service.js";

const games = new Map();

function getGame(table) {
  return games.get(table);
}

async function handleGoal(table, team) {
  console.log(`Handling goal for table: ${table}, team: ${team}`);
  const game = getGame(table);
  if (!game) {
    console.error(`Game not found for table: ${table}`);
    return;
  }
  switch (team) {
    case "HOME":
      game.score.home += 1;
      break;
    case "AWAY":
      game.score.away += 1;
      break;
    default:
      console.error(`Unknown team: ${team}`);
      return;
  }

  await updateGame(game);
}

async function handleReset(table) {
  console.log(`Handling reset for table: ${table}`);
  const game = getGame(table);
  if (!game) {
    console.error(`Game not found for table: ${table}`);
    return;
  }

  const newGame = await createGame();
  games.set(table, newGame);
}

async function startGame(table) {
  if (games.has(table)) {
    console.error(`Game already exists for table: ${table}`);
    return;
  }

  const newGame = await createGame();
  games.set(table, newGame);

  return newGame;
}

export { getGame, handleGoal, handleReset, startGame };
