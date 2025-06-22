export async function createGame() {
  return {
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
