import mqtt from "mqtt"; // import namespace "mqtt"
let client = mqtt.connect({
  port: 8883,
  host: "mqtt.devilsoft.de",
  protocol: "mqtts",
}); // create a client

let gameID;

const score = {
  home: 0,
  away: 0,
};

client.on("connect", () => {
  client.subscribe("/table/ads_1/goal", (err) => {
    if (!err) {
      console.log("Subscribed to /table/ads_1/goal");
    }
  });
  client.subscribe("/table/ads_1/reset", (err) => {
    if (!err) {
      console.log("Subscribed to /table/ads_1/reset");
    }
  });
  client.subscribe("/table/ads_1/score", (err) => {
    if (!err) {
      console.log("Subscribed to /table/ads_1/score");
      client.publish("/table/ads_1/score", JSON.stringify(score));
      fetch("https://scoreboard.devilsoft.de/api/v1/games/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ home: 0, away: 0 }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.gameID) {
            gameID = data.gameID;
            console.log("New game ID:", gameID);
            client.publish("/table/ads_1/score", JSON.stringify(score));
          }
        })
        .catch((err) => {
          console.error("Failed to create new game:", err);
        });
    }
  });
});

client.on("message", (topic, message) => {
  if (topic === "/table/ads_1/goal") {
    const team = message.toString();
    if (team === "HOME") {
      score.home += 1;
    } else if (team === "AWAY") {
      score.away += 1;
    }
    if (gameID) {
      fetch(`https://scoreboard.devilsoft.de/api/v1/games/${gameID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(score),
      }).catch((err) => {
        console.error("Failed to update game score:", err);
      });
    }
    client.publish("/table/ads_1/score", JSON.stringify(score));
  } else if (topic === "/table/ads_1/reset") {
    score.home = 0;
    score.away = 0;

    fetch("https://scoreboard.devilsoft.de/api/v1/games/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ home: 0, away: 0 }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.gameID) {
          gameID = data.gameID;
          console.log("New game ID:", gameID);
          client.publish("/table/ads_1/score", JSON.stringify(score));
        }
      })
      .catch((err) => {
        console.error("Failed to create new game:", err);
      });
  } else if (topic === "/table/ads_1/score") {
    console.log("Score Update:", message.toString());
  }
});

client.on("error", (err) => {
  console.error("MQTT Error:", err);
});
