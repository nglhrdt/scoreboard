export async function createGame() {
  return {
    gameID: Math.random().toString(36).substring(2, 15),
    score: {
      home: 0,
      away: 0,
    },
    players: {
      home: [],
      away: [],
    },
  };
}

export async function stopGame(game) {}

export async function updateGame(game) {}
