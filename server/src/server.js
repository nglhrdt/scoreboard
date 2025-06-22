import dotenv from "dotenv";
import mqtt from "mqtt"; // import namespace "mqtt"
import { getGame, handleGoal, handleReset, startGame } from "./game-manager.js"; // import game management functions

dotenv.config();

const client = mqtt.connect({
  port: process.env.MQTT_PORT,
  host: process.env.MQTT_HOST,
  protocol: process.env.MQTT_PROTOCOL,
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
}); // create a client

const tables = ["ads_1"]; // TODO the tables should register
const baseTopic = "table";
const feature = ["player", "goal", "reset"];

function publishScore(table) {
  const game = getGame(table);
  if (!game) {
    console.error(`Game not found for table: ${table}`);
    return;
  }
  const topic = `${baseTopic}/${table}/score`;
  client.publish(topic, JSON.stringify(game.score), { qos: 1, retain: true });
}

function publishGame(table) {
  startGame(table).then((game) => {
    client.publish(`${baseTopic}/${table}/score`, JSON.stringify(game.score), {
      qos: 1,
      retain: true,
    });
    console.log(`Game started for table: ${table}`);
  });
}

client.on("connect", () => {
  tables.forEach((table) => {
    publishGame(table); // Start the game for each table
    feature.forEach((useCase) => {
      const topic = `${baseTopic}/${table}/${useCase}`;
      client.subscribe(topic, (err) => {
        if (!err) {
          console.log(`Subscribed to ${topic}`);
        }
      });
    });
  });
});

client.on("message", (topic, message) => {
  const [_, table, useCase] = topic.split("/");

  switch (useCase) {
    case "player":
      const playerData = JSON.parse(message.toString());
      if (!playerData || !playerData.name) {
        console.error("Invalid player data received:", playerData);
        return;
      }
      const game = getGame(table);
      if (!game) {
        console.error(`Game not found for table: ${table}`);
        return;
      }
      console.log(`Player joined: ${playerData.name} on table: ${table}`);
      break;
    case "goal":
      const team = message.toString();
      handleGoal(table, team);
      publishScore(table);
      break;
    case "reset":
      handleReset(table).then(() => {
        publishScore(table);
      });
      break;
    default:
      console.log(`Unknown use case: ${useCase}`);
      return;
  }
});

client.on("error", (err) => {
  console.error("MQTT Error:", err);
});
